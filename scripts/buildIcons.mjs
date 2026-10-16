import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../src/v2/icons');
const OUTPUT_DIR = path.join(__dirname, '../generated/v2/icons');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Multi-color icons (`*-color.svg`) keep their own fills. Every other icon is single-color
 * and has its fills stripped so apps can tint it.
 */
const isColorIcon = (file) => file.endsWith('-color.svg');

function convertSvgToComponent(file) {
  const content = fs.readFileSync(path.join(ICONS_DIR, file), 'utf-8');
  const colorIcon = isColorIcon(file);

  const optimizedSvg = optimize(content, {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            // Keep colors exactly as authored on color icons. convertColors would turn
            // "white" into "#fff", which apps commonly remap to their tint color (the
            // companion app's .svgrrc does), repainting the icon's white details.
            ...(colorIcon ? { convertColors: false } : {}),
          },
        },
      },
      'removeXMLNS',
      'convertStyleToAttrs',
      ...(colorIcon
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

fs.readdirSync(ICONS_DIR)
  .filter(file => file.endsWith('.svg'))
  .forEach(convertSvgToComponent);
