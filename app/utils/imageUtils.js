import Pica from 'pica/dist/pica';
import R from 'ramda';
import StreamReader from './stream-reader';
/**
 * Utility to extract best matching image key given a width
 * @param width <number> a given width
 * @param obj <object> images object
 *
 * obj = {
 *      xs: {},
 *      sm: {},
 *      ...
 * }
 *
 * @returns imageKey <string> a key of obj
 */
function findClosestMatch (width, obj, initialKey) {
    let imageKey = initialKey || '';
    const sortedKeys = Object.keys(obj).sort((a, b) => obj[a].width > obj[b].width);
    for (let i = sortedKeys.length - 1; i >= 0; i -= 1) {
        const key = sortedKeys[i];
        if (obj[key].width >= width) {
            imageKey = key;
        }
    }
    if (!imageKey) {
        imageKey = sortedKeys[sortedKeys.length - 1];
    }
    return imageKey;
}

function findBestMatch (width, obj, initialKey) {
    let curr = initialKey ? obj[initialKey].width : 0;
    let imageKey = initialKey || '';
    let diff = curr - width;
    for (const key of Object.keys(obj)) { // eslint-disable-line no-restricted-syntax
        const newDiff = obj[key].width - width;
        if ((newDiff < diff && newDiff >= 0) || (diff < 0 && newDiff > 0)) {
            diff = newDiff;
            curr = obj[key].width;
            imageKey = key;
        }
    }
    if (!imageKey) {
        return findClosestMatch(width, obj, initialKey);
    }
    return imageKey;
}

function imageCreator (arrayBuffer, baseUrl) {
    // if arrayBuffer is string it means that it comes from ipfs
    if (baseUrl && R.is(String, arrayBuffer)) {
        if (arrayBuffer.includes(`${baseUrl}`) && arrayBuffer !== `${baseUrl}/`) {
            return `${arrayBuffer}`;
        }
        if (arrayBuffer === `${baseUrl}/` || arrayBuffer.length === 0) {
            return null;
        }
        return `${baseUrl}/${arrayBuffer}`;
    }
    if (R.is(Uint8Array, arrayBuffer)) {
        const blobFile = new Blob([arrayBuffer]);
        return window.URL.createObjectURL(blobFile);
    }
    // const arr = Object.keys(arrayBuffer).map(key => arrayBuffer[key]);
    // const blobFile = new Blob([new Uint8Array(arr)]);
    // return window.URL.createObjectURL(blobFile);
    // return null;
}
/**
 * Utility to extract first image from draftjs generated content;
 * @param {object} content Draft-js generated content;
 * @returns {array} image Array of versions of an image;
 */
function extractImageFromContent (content) {
    const { entityMap } = content;
    if (!entityMap) {
        console.error(`entityMap not found inside content param.
            Make sure you have passed the right content!`
        );
        return null;
    }
    if (entityMap.length === 0) {
        return null;
    }
    const imageEntity = entityMap.filter(entity => entity.type === 'image');
    if (imageEntity.length > 0) {
        return imageEntity[0].data;
    }
    return null;
}
/**
 * @TODO Move this to a config file
 */

const settings = {
    extentions: ['jpg', 'jpeg', 'png', 'svg'],
    resizerSettings: {
        alphaChannel: true,
        unsharpAmount: 50,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
    },
    defaultQuality: 3,
    minWidth: 360,
    minHeight: null,
    animatedGifSupport: true,
    /**
     * Handling multiple files uploaded at once
     * if true, the resize method will return array
     * if false, return only one object
     */
    multiple: false,
    imageWidths: [{
        key: 'xxl',
        res: 1920
    }, {
        key: 'xl',
        res: 1280
    }, {
        key: 'md',
        res: 700
    }, {
        key: 'sm',
        res: 640
    }, {
        key: 'xs',
        res: 320
    },
    ]
};
const convertToArray = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const arrBuff = new ArrayBuffer(byteString.length);
    const imgArr = new Uint8Array(arrBuff);
    for (let i = 0; i < byteString.length; i += 1) {
        imgArr[i] = byteString.charCodeAt(i);
    }
    return {
        value: imgArr,
        mimeString
    };
};
const canvasToArray = canvas =>
    new Promise((resolve, reject) => {
        try {
            const canvasData = canvas.toDataURL('image/png', 0.7);
            const canvasArray = convertToArray(canvasData);
            return resolve({
                src: canvasArray.value,
                width: canvas.width,
                height: canvas.height
            });
        } catch (exception) {
            console.log(exception);
            return reject(exception);
        }
    });

// method to resize static (non animated gifs) images;
const resizeImage = (image, options) => {
    const { actualWidth, actualHeight } = options;
    const imageWidths = settings.imageWidths.filter((widthObj) => {
        if (options.maxResizeWidth) {
            return widthObj.res <= actualWidth && widthObj.res <= options.maxResizeWidth;
        }
        return widthObj.res <= actualWidth;
    });

    // If image is smaller than 320px (xs) but this is allowed, skip the resize
    const smallestWidth = settings.imageWidths[settings.imageWidths.length - 1];
    const { minWidth } = options;
    const skipResize = minWidth && actualWidth < smallestWidth.res && actualWidth > minWidth;
    if (!imageWidths.length && skipResize) {
        imageWidths.push(smallestWidth);
    }

    const imageObject = {};
    let p = Promise.resolve();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const pica = new Pica();
    /**
     * Sequential processing is recommended by pica.
     * see https://github.com/nodeca/pica#api
     */
    imageWidths.forEach((widthObj, index) => {
        p = p.then(() => {
            const targetWidth = skipResize ? actualWidth : widthObj.res;
            console.log('target width', targetWidth);
            const targetHeight = (actualHeight * targetWidth) / actualWidth;
            ctx.canvas.width = targetWidth;
            ctx.canvas.height = targetHeight;
            ctx.fillStyle = 'white';
            /**
             * pica.resizeCanvas(from, to, options, cb)
             */
            return pica.resize(image, canvas, {
                quality: 3,
                alpha: true
            }).then(destCanvas =>
                canvasToArray(destCanvas).then((result) => {
                    if (options.progressHandler && typeof options.progressHandler === 'function') {
                        const { maxProgress } = options;
                        if (!maxProgress) {
                            return console.error('Please provide maxProgress attribute when using progressHandler!');
                        }
                        const currentProgress = index * (maxProgress / (imageWidths.length - 1));
                        options.progressHandler(currentProgress);
                    }
                    if (options.idGenerator && typeof options.idGenerator === 'function') {
                        result.id = options.idGenerator();
                    }
                    imageObject[widthObj.key] = result;
                    return imageObject;
                })
            ).catch(err => Promise.reject(err));
        });
    });
    return p;
};

const resizeAnimatedGif = (dataUrl, image, options) => {
    // resize gif
    const imageArray = convertToArray(dataUrl);
    const streamReader = new StreamReader(imageArray.value);
    return new Promise((resolve, reject) => {
        if (streamReader.readAscii(3) !== 'GIF') {
            return reject('Gif file not recognised!');
        }
        const frameCount = streamReader.getFrameNumber();
        // resize 1 frame for presentation;
        return resizeImage(image, options).then((imageObj) => {
            if (frameCount > 0) {
                // it`s animated
                imageObj.gif = {
                    width: options.actualWidth,
                    height: options.actualHeight,
                    src: imageArray.value
                };
            }
            return resolve(imageObj);
        });
    });
};

const getRawDataUrl = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result);

        try {
            reader.readAsDataURL(file);
        } catch (exception) {
            console.error(exception);
            reject(exception);
        }
    });

const getImageSize = (imagePath, options) => {
    const image = document.createElement('img');
    return new Promise((resolve, reject) => {
        image.onload = () => {
            const imageWidth = image.width;
            const imageHeight = image.height;
            if (options && imageWidth < options.minWidth) {
                return reject(`Please provide an image with minimum width of ${options.minWidth} pixels`);
            }
            if (options && imageHeight < options.minHeight) {
                return reject(`Please provide an image with minimum height of ${options.minHeight} pixels`);
            }
            return resolve({ width: imageWidth, height: imageHeight, imageObj: image });
        };
        image.src = imagePath;
    });
};

/**
 * Utility to resize images using Html5 canvas
 * @param {Array} imagePaths Path(s) returned from file input
 * @param {Object} options
 * @param {Number} options.minHeight Minimum allowed height
 * @param {Number} options.minWidth Minimum allowed width
 * @param {Array} options.imageWidths Resize using keys in this array only
 * @returns {Array} promises Array of promises for each passed path
 *
 * @example usage
 *  const filePromises = resizeImage([/path/to/image.jpg, /path/to/image2.png], {
 *      minWidth: 250,
 *      minHeight: 200,,
 *      ...settings
 *  });
 *   Promise.all(filePromises).then(results =>
 *       results.forEach(result => {
 *          result is an array containing all image variants for a given path
 *          result[0].src     {Uint8Array}
 *          result[0].height  {resulting height after resize}
 *          result[0].width   {resulting width after resize}
 *       });
 *   ).catch(reason => reason {string} 'Image height is smaller than minimum allowed of 200 pixels')
 */
const getResizedImages = (inputFiles, options) => {
    // handle ipfs files here
    if (options && options.ipfsFile) {
        // fileList is only a string => eg. http://localhost:8080/ipfs/ipfs_hash
        const imagePromises = inputFiles.map(img =>
            getImageSize(img, options).then((results) => {
                const { height, width } = results;
                options.actualWidth = width;
                options.actualHeight = height;
                return resizeImage(results.imageObj, options);
            }));
        return imagePromises;
    }

    const gifPromises = [];
    const imagePromises = [];

    Array.from(inputFiles).forEach((file, index) => {
        const fileName = file.name;
        const ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
        // treat gif extention as it is animated gif to prevent double processing
        if (ext === 'gif' && settings.animatedGifSupport) {
            gifPromises[index] = getRawDataUrl(file, options).then(imageDataUrl =>
                // imageData should be the original animated gif Uint8Array
                getImageSize(file.path, options).then((size) => {
                    const { height, width } = size;
                    options.actualHeight = height;
                    options.actualWidth = width;
                    return resizeAnimatedGif(imageDataUrl, size.imageObj, options);
                }));
        } else if (settings.extentions.includes(ext)) {
            imagePromises[index] = getImageSize(file.path, options).then((results) => {
                const { height, width } = results;
                options.actualWidth = width;
                options.actualHeight = height;
                return resizeImage(results.imageObj, options);
            });
        }
    });
    return imagePromises.concat(gifPromises);
};

export default imageCreator;
export { getResizedImages, getImageSize, extractImageFromContent, findBestMatch, findClosestMatch };
