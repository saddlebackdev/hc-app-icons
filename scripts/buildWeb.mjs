import fs from 'fs';
import path from 'path';
import { transform } from '@svgr/core';
import { optimize } from 'svgo';
import { fileURLToPath } from 'url';
import { getIconSources, parseFileName } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../generated/v2/web/components');


if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertSvgToComponent({ file, filePath, multiColor }) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const componentName = 'Icon' + parseFileName(path.basename(file, '.svg'));

  const optimizedSvg = optimize(content, {
    plugins: [
      { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
      'removeXMLNS',
      'convertStyleToAttrs',
    ],
  });
  
  const jsCode = await transform(
    optimizedSvg.data,
    {
      typescript: true,
      icon: true,
      plugins: [
        '@svgr/plugin-jsx',
        '@svgr/plugin-prettier',
      ],
      replaceAttrValues: {
        "#333": "currentColor",
      },
      titleProp: true,
      template: ({ componentName, props, jsx, interfaces }, { tpl }) => {
        return tpl`
            import { SVGProps } from 'react';
            import generateIcon from '../generateIcon';
            interface SVGRProps {
              title?: string;
              titleId?: string;
            }
            const ${componentName} = ({
              title,
              titleId,
              ...props
            }: SVGProps<SVGSVGElement> & SVGRProps) => {
              return ${jsx};
            };
            export default generateIcon(${componentName}, { multiColor: ${String(multiColor)} });
        `;
      },
    }
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${componentName}.tsx`),
    jsCode
  );
}

getIconSources().forEach(convertSvgToComponent);
