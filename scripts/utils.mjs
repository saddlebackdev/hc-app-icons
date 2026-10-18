import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const firstLetterToUpperCase = letter => {
    const str = letter.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseFileName = (name, prefix = '') => {
    const nameSplit = name.split('-');
    return `${firstLetterToUpperCase(prefix)}${nameSplit
        .map(n => firstLetterToUpperCase(n))
        .join('')}`;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ICONS_DIR = path.join(__dirname, '../src/v2/icons');
export const COLOR_ICONS_DIR = path.join(__dirname, '../src/v2/color-icons');

/**
 * Lists every v2 source icon. Single-color icons live in src/v2/icons and multi-color
 * icons in src/v2/color-icons; both are built into the same output folder, so a name
 * may only exist in one of them.
 */
export const getIconSources = () => {
    const readDir = (dir, multiColor) => fs.readdirSync(dir)
        .filter(file => file.endsWith('.svg'))
        .map(file => ({ file, filePath: path.join(dir, file), multiColor }));

    const sources = [...readDir(ICONS_DIR, false), ...readDir(COLOR_ICONS_DIR, true)];

    const seen = new Set();
    sources.forEach(({ file }) => {
        if (seen.has(file)) {
            throw new Error(`Icon "${file}" exists in both src/v2/icons and src/v2/color-icons.`);
        }
        seen.add(file);
    });

    return sources;
};
