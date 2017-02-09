import pica from 'pica/dist/pica.js';
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
    for (const key of Object.keys(obj)) {
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

    const blobFile = new Blob([arrayBuffer]);
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

const resizeAnimatedGif = (dataUri, options) => {
    // resize gif
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const arrBuff = new ArrayBuffer(byteString.length);
    const imgArr = new Uint8Array(arrBuff);
    for (let i = 0; i < byteString.length; i += 1) {
        imgArr[i] = byteString.charCodeAt(i);
    }
    const streamReader = new StreamReader(imgArr);
    return new Promise((resolve, reject) => {
        if (streamReader.readAscii(3) !== 'GIF') {
            console.log('it is not an animated gif. Not sure if this is an image, actually!');
            return reject('Gif file not recognised!');
        }
        const frameCount = streamReader.getFrameNumber();
        console.log(frameCount, 'the frames');
        // resize 1 frame for presentation;
        return resizeImage(imgArr, options).then((imageObj) => {
            if (frameCount > 0) {
                // it`s animated
                imageObj.gif = {
                    width: options.actualWidth,
                    height: options.actualHeight,
                    src: imgArr
                };
            }
            return resolve(imageObj);
        });
    });

    // const uint8Arr = new Uint8Array(arrayBuffer.data);
    // const streamReader = new StreamReader(new Uint8Array(arrayBuffer.data));
    // console.log(new Uint8Array(arrayBuffer.data), 'the buffer');
    // console.log(streamReader.readAscii(6), 'read 3 ascii');
    // if (streamReader.readAscii(6) != 'GIF89a') {
    //     console.log('this is not an animated gif file');
    // }
};

const getImageHeight = (targetWidth, width, height) => {
    return targetWidth / (width / height);
};
// return pixel data from an image;
const canvasToArray = (canvas, width, height) => {
    return new Promise((resolve) => {
        const blobCb = () => (blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                return resolve({
                    data: reader.result,
                    width,
                    height
                });
            };
            reader.readAsArrayBuffer(blob);
        };
        canvas.toBlob(blobCb(), 'image/jpg', '0.9');
    });
};
const getRawDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            return resolve(reader.result);
        };
        try {
            reader.readAsDataURL(file);
        } catch (exception) {
            console.error(exception);
            reject(exception);
        }
    });
};

const getImageSize = (imagePath, image, options) => {
    return new Promise((resolve, reject) => {
        image.onload = () => {
            const imageWidth = image.width;
            const imageHeight = image.height;
            console.log('onLoad');
            if (options && imageWidth < options.minWidth) {
                return reject(`Please provide an image with minimum width of ${options.minWidth} pixels`);
            }
            if (options && imageHeight < options.minHeight) {
                return reject(`Please provide an image with minimum height of ${options.minHeight} pixels`);
            }
            return resolve({ width: imageWidth, height: imageHeight });
        };
        image.src = imagePath;
    });
};
// method to resize static (non animated gifs) images;
const resizeImage = (arrayBuffer, options, gifFile) => {
    const { actualWidth, actualHeight } = options;
    const aspectRatio = actualWidth / actualHeight;
    const imageWidths = settings.imageWidths.filter(widthObj => widthObj.res <= actualWidth);
    const imageObject = {};
    if (gifFile) {
        imageObject.gif = gifFile;
    }
    let p = Promise.resolve();
    /**
     * Sequential processing is recommended by pica.
     * see https://github.com/nodeca/pica#api
     */
    imageWidths.forEach((widthObj) => {
        p = p.then(() => {
            try {
                console.time(`resize to ${widthObj.res} took`);
                return pica.resizeBuffer({
                    src: arrayBuffer,
                    width: actualWidth,
                    height: actualHeight,
                    toWidth: widthObj.res,
                    toHeight: Math.round(getImageHeight(widthObj.res, actualWidth, actualHeight)),
                }, (err, output) => {
                    console.timeEnd(`resize to ${widthObj.res} took`);
                    imageObject[widthObj.key] = {
                        src: new Uint8Array(output),
                        width: widthObj.res,
                        height: widthObj.res / aspectRatio
                    };
                    return imageObject;
                });
            } catch (exception) {
                return Promise.reject(exception);
            }
        });
    });
    return p.then(() => {
        console.log('resulted image object =>', imageObject);
        console.groupEnd();
        return imageObject;
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
    const gifFiles = [];
    const imageFiles = [];
    const promises = [];
    console.group('resize results and timings:');
    Array.from(inputFiles).forEach((file) => {
        const fileName = file.name;
        const ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
        console.log('original image', file.name, 'has a size of:', Math.floor(file.size / 1024), 'KiB');
        if (ext === 'gif' && settings.animatedGifSupport) return gifFiles.push(file);
        if (settings.extentions.includes(ext)) {
            return imageFiles.push(file);
        }
        return Promise.reject(`Specified image format is not supported. Please use one of following formats: ${settings.extentions.join(', ')}`);
    });
    const image = new Image();
    // resize gifs
    for (let i = gifFiles.length - 1; i >= 0; i -= 1) {
        const imageFile = gifFiles[i];
        const p = getRawDataUrl(imageFile, options).then((imageDataUrl) => {
            // imageData should be the original animated gif Uint8Array
            console.log('imageDataUrl');
            return getImageSize(imageFile.path, image, options).then((size) => {
                const { height, width } = size;
                options.actualHeight = height;
                options.actualWidth = width;
                console.log(size, 'the size');
                return resizeAnimatedGif(imageDataUrl, options);
            });
        });
        promises.push(p);
    }
    // resize static images
    for (let i = imageFiles.length - 1; i >= 0; i -= 1) {
        const imageFile = imageFiles[i]; // string
        const p = getRawDataUrl(imageFile, options).then((imageDataUrl) => {
            return getImageSize(imageFile.path, image, options).then((size) => {
                const { height, width } = size;
                options.actualWidth = width;
                options.actualHeight = height;
                return resizeImage(imageDataUrl, options);
            });
        });
        promises.push(p);
    }
    return promises;
};

export default imageCreator;
export { getResizedImages, extractImageFromContent, findBestMatch, findClosestMatch };
