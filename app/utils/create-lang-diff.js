/**
 * Utility to create a diff between translated languages and en (en is always generated)
 *
 * Usage: npm run lang-diff
 *
 * This will create a `diff.md` file with the filename and keys that must be translated
 * inside each language folder
 * (eg. `intl/es/diff.md` will contain a list of files and keys that must be translated).
 *
 */

import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';

const TRANSLATIONS_FOLDER = './intl/';
const REFERENCE_LANG = 'en';

const isDir = (folderPath, name) => fs.lstatSync(path.join(folderPath, name)).isDirectory()

const getFolderContents = (folderPath, directories = true) =>
    new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files.filter((name) => {
                if (directories) {
                    return isDir(folderPath, name);
                }
                return !isDir(folderPath, name);
            }));
        });
    });

getFolderContents(TRANSLATIONS_FOLDER).then((dirs) => {
    const langs = dirs.filter(dir => dir !== REFERENCE_LANG);
    /**
     * construct language objects
     */
    const langTrees = langs.map((lang) => {
        const filePattern = `${TRANSLATIONS_FOLDER}${lang}/**/*.json`;
        const files = globSync(filePattern).map(file => ({
            path: file,
            fileName: path.basename(file),
            json: JSON.parse(fs.readFileSync(file, 'utf8'))
        }));
        return {
            language: lang,
            files
        };
    });
});
