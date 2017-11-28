import * as fs from 'fs';
import * as path from 'path';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const TRANSLATIONS_FOLDER = './intl/';
const LANG_DIR = './app/locale-data/';

const getAvailableTranslations = translationsPath =>
    new Promise((resolve, reject) => {
        fs.readdir(translationsPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files.filter(name =>
                fs.lstatSync(path.join(translationsPath, name)).isDirectory() && name !== 'app'
            ));
        });
    });
const getDefaultMessages = pattern =>
    globSync(pattern)
        .map(filename => fs.readFileSync(filename, 'utf8'))
        .map((file) => {
            try {
                return JSON.parse(file);
            } catch (ex) {
                return console.error('ERROR parsing json. SHOWING A SAMPLE FROM FILE! \n', file.slice(0, 240), '...');
            }
        })
        .reduce((collection, descriptors) => {
            descriptors.forEach(({ id, defaultMessage }) => {
                if (Object.prototype.hasOwnProperty.call(collection, id)) {
                    throw new Error(`Duplicate message id: ${id}`);
                }
                collection[id] = defaultMessage;
            });

            return collection;
        }, {});

getAvailableTranslations(TRANSLATIONS_FOLDER).then((translations) => {
    translations.forEach((translation) => {
        const pattern = `${TRANSLATIONS_FOLDER}${translation}/**/*.json`;
        const defaultMessages = getDefaultMessages(pattern);
        try {
            mkdirpSync(LANG_DIR);
            fs.writeFileSync(`${LANG_DIR}${translation}.json`, JSON.stringify(defaultMessages, null, 2));
        } catch (ex) {
            console.error('UUPS!!', ex);
        }
    });
}).catch(err => console.error('An error occured!'));

