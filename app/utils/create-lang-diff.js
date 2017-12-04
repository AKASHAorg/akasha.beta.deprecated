import manageTranslations from 'react-intl-translations-manager';

manageTranslations({
    messagesDirectory: './intl/en/',
    translationsDirectory: './app/locale-data/',
    languages: ['es'],
});

// /**
//  * Utility to create a diff between translated languages and en (en is always generated)
//  *
//  * Usage: npm run lang-diff
//  *
//  * This will create a `diff.md` file with the filename and keys that must be translated
//  * inside each language folder
//  * (eg. `intl/es/diff.md` will contain a list of files and keys that must be translated).
//  *
//  */

// import * as path from 'path';
// import * as fs from 'fs';
// import { sync as globSync } from 'glob';

// const TRANSLATIONS_FOLDER = './intl/';
// const REFERENCE_LANG = 'en';

// const isDir = (folderPath, name) => fs.lstatSync(path.join(folderPath, name)).isDirectory();

// const getFolderContents = (folderPath, directories = true) =>
//     new Promise((resolve, reject) => {
//         fs.readdir(folderPath, (err, files) => {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(files.filter((name) => {
//                 if (directories) {
//                     return isDir(folderPath, name);
//                 }
//                 return !isDir(folderPath, name);
//             }));
//         });
//     });

// const diffJson = (refJson, targetJson) => new Promise((resolve, reject) => {
//     const diff = refJson.map((obj) => {
//         const { id } = obj;
//         const translated = targetJson.find(tObj => tObj.id === id);
//         if (!translated) {
//             return id;
//         }
//         return null;
//     });
//     return resolve(diff);
// });

// const diffObjects = (refObj, langsObj) => {
//     const p = [];
//     Object.keys(langsObj).forEach((key) => {
//         const langObj = langsObj[key];
//         Object.keys(langObj).forEach((fileKey) => {
//             const file = langObj[fileKey];
//             p.push(
//                 diffJson(refObj[fileKey].json, file.json)
//                     .then(dObj => dObj.filter(obj => obj !== null))
//                     .then(filtered => ({
//                         [key]: filtered
//                     }))
//             );
//         });
//     });
//     return Promise.all(p);
// };

// getFolderContents(TRANSLATIONS_FOLDER).then((dirs) => {
//     const langs = dirs.filter(dir => dir !== REFERENCE_LANG);
//     const refLangObj = {};
//     const langsObj = {};
//     /**
//      * construct language objects
//      */
//     langs.forEach((lang) => {
//         const filePattern = `${TRANSLATIONS_FOLDER}${lang}/**/*.json`;
//         langsObj[lang] = {};
//         globSync(filePattern).forEach((file) => {
//             langsObj[lang][path.basename(file, '.json')] = {
//                 path: file,
//                 fileName: path.basename(file),
//                 json: JSON.parse(fs.readFileSync(file, 'utf8'))
//             };
//         });
//     });

//     globSync(`${TRANSLATIONS_FOLDER}en/**/*.json`).forEach((fileName) => {
//         refLangObj[path.basename(fileName, '.json')] = {
//             path: fileName,
//             fileName: path.basename(fileName),
//             json: JSON.parse(fs.readFileSync(fileName, 'utf8'))
//         };
//     });

//     diffObjects(refLangObj, langsObj).then((diffs) => {
//         console.log(diffs, 'the diffs');
//         // fs.writeFile(`${TRANSLATIONS_FOLDER}${lang}/difference.md`,
//         //     `### The following keys must be translated:

//         //     `
//         // );
//     });
// });
