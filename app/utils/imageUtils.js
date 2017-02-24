import pica from 'pica/dist/pica';
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
    if (baseUrl && typeof arrayBuffer === 'string') {
        if (arrayBuffer.includes(`${baseUrl}`) && arrayBuffer !== `${baseUrl}/`) {
            return `${arrayBuffer}`;
        }
        if (arrayBuffer === `${baseUrl}/` || arrayBuffer.length === 0) {
            return null;
        }
        return `${baseUrl}/${arrayBuffer}`;
    }
    if (arrayBuffer instanceof Uint8Array) {
        const blobFile = new Blob([arrayBuffer]);
        return window.URL.createObjectURL(blobFile);
    }
    const arr = Object.keys(arrayBuffer).map(key => arrayBuffer[key]);
    const blobFile = new Blob([new Uint8Array(arr)]);
    return window.URL.createObjectURL(blobFile);
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
    defaultQuality: 3,
    minWidth: 360,
    minHeight: null,
    alphaChannel: false,
    unsharpAmount: 50,
    unsharpRadius: 0.6,
    unsharpThreshold: 2,
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
    }]
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
            const canvasData = canvas.toDataURL('image/png', 0.8);
            const canvasArray = convertToArray(canvasData);
            return resolve({
                src: canvasArray.value,
                width: canvas.width,
                height: canvas.height
            });
        } catch (exception) {
            console.log(exception);
            reject(exception);
        }
    });
// method to resize static (non animated gifs) images;
const resizeImage = (image, options) => {
    const { actualWidth, actualHeight } = options;
    const imageWidths = settings.imageWidths.filter(widthObj => widthObj.res <= actualWidth);
    const imageObject = {};
    let p = Promise.resolve();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    /**
     * Sequential processing is recommended by pica.
     * see https://github.com/nodeca/pica#api
     */
    imageWidths.forEach((widthObj) => {
        p = p.then(() => {
            const targetWidth = widthObj.res;
            const targetHeight = (actualHeight * widthObj.res) / actualWidth;
            ctx.canvas.width = targetWidth;
            ctx.canvas.height = targetHeight;
            ctx.fillStyle = 'white';
            return new Promise((resolve, reject) => {
                try {
                    // console.time(`resize to ${widthObj.res} took`);
                    /**
                     * pica.resizeCanvas(from, to, options, cb)
                     */
                    pica.resizeCanvas(image, canvas, {
                        quality: 3,
                        alpha: true
                    }, (err) => {
                        // console.timeEnd(`resize to ${widthObj.res} took`);
                        if (err) {
                            // console.error(err);
                            return Promise.reject(err);
                        }
                        return canvasToArray(canvas).then((result) => {
                            imageObject[widthObj.key] = {
                                width: result.width,
                                height: result.height,
                                src: result.src
                            };
                            return resolve(imageObject);
                        });
                    });
                } catch (exception) {
                    return reject(exception);
                }
            });
        });
    });
    return p.then((img) => {
        // console.log('resulted image object =>', imageObject);
        // console.groupEnd();
        return img;
    });
};

const resizeAnimatedGif = (dataUrl, image, options) => {
    // resize gif
    const imageArray = convertToArray(dataUrl);
    const streamReader = new StreamReader(imageArray.value);
    return new Promise((resolve, reject) => {
        if (streamReader.readAscii(3) !== 'GIF') {
            // console.log('It is not an animated gif. Not sure if this is an image, actually!');
            return reject('Gif file not recognised!');
        }
        const frameCount = streamReader.getFrameNumber();
        // console.log('number of frames:', frameCount);
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
    // const promises = [];
    // console.group('resize results and timings:');
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
    const gifPromises = Array.from(inputFiles).filter((file) => {
        const fileName = file.name;
        const ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
        // console.log('original image', file.name, 'has a size of:', Math.floor(file.size / 1024), 'KiB');
        // treat gif extention as it is animated gif to prevent double processing
        return (ext === 'gif' && settings.animatedGifSupport);
    }).map(imageFile =>
        getRawDataUrl(imageFile, options).then(imageDataUrl =>
            // imageData should be the original animated gif Uint8Array
            getImageSize(imageFile.path, options).then((size) => {
                const { height, width } = size;
                options.actualHeight = height;
                options.actualWidth = width;
                // console.info(`original image size ${width}px width x ${height}px height.`);
                return resizeAnimatedGif(imageDataUrl, size.imageObj, options);
            })));
    const imagePromises = Array.from(inputFiles).filter((file) => {
        const fileName = file.name;
        const ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
        return settings.extentions.includes(ext);
    }).map(imageFile =>
        getImageSize(imageFile.path, options).then((results) => {
            const { height, width } = results;
            options.actualWidth = width;
            options.actualHeight = height;
            return resizeImage(results.imageObj, options);
        }));
    return [...gifPromises, ...imagePromises];
};

export default imageCreator;
export { getResizedImages, extractImageFromContent, findBestMatch, findClosestMatch };
