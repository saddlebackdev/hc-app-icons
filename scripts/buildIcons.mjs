import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';
import { fileURLToPath } from 'url';
import { getIconSources } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../generated/v2/icons');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Single-color icons (src/v2/icons) have their fills stripped so apps can tint them.
 * Multi-color icons (src/v2/color-icons) keep their fills exactly as authored.
 */
function convertSvgToComponent({ file, filePath, multiColor }) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const optimizedSvg = optimize(content, {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            // Keep colors exactly as authored on multi-color icons. convertColors would turn
            // "white" into "#fff", which apps commonly remap to their tint color (the
            // companion app's .svgrrc does), repainting the icon's white details.
            ...(multiColor ? { convertColors: false } : {}),
          },
        },
      },
      'removeXMLNS',
      'convertStyleToAttrs',
      ...(multiColor
        ? []
        : [
            {
              name: 'removeAttrs',
              params: {
                attrs: ['fill'],
              },
            },
          ]),
    ],
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, file),
    optimizedSvg.data
  );
}

getIconSources().forEach(convertSvgToComponent);
