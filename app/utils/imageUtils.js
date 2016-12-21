import r from 'ramda';

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
    let curr = initialKey ? obj[initialKey].width : 0;
    let imageKey = initialKey || '';
    let diff = Math.abs(width - curr);
    for (const key of Object.keys(obj)) {
        const newDiff = Math.abs(width - obj[key].width);
        if (newDiff < diff) {
            diff = newDiff;
            curr = obj[key].width;
            imageKey = key;
        }
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
        return `${baseUrl}/${arrayBuffer}`;
    }

    const blobFile = new Blob([arrayBuffer], { type: 'image/jpg' });
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
const imageWidths = [
    {
        key: 'xl',
        res: 1280
    }, {
        key: 'lg',
        res: 1024
    }, {
        key: 'md',
        res: 768
    }, {
        key: 'sm',
        res: 640
    }, {
        key: 'xs',
        res: 320
    }
];

function convertToBlob (canvas, widthObj) {
    return new Promise((resolve) => {
        const blobCb = (canvasWidth, canvasHeight) => (blob) => {
            const reader = new FileReader();
            reader.onloadend = () =>
                resolve({
                    key: widthObj.key,
                    src: new Uint8Array(reader.result),
                    width: canvasWidth,
                    height: canvasHeight
                });
            reader.readAsArrayBuffer(blob);
        };
        canvas.toBlob(blobCb(canvas.width, canvas.height), 'image/jpg', '0.9');
    });
}

function readImageData (imagePath, canvas, ctx, options) {
    return new Promise((resolve, reject) => {
        const availableWidths = [];
        let resizeWidths = imageWidths;
        const img = new Image();
        const { minWidth, minHeight } = options;
        if (options.imageWidths) {
            resizeWidths = imageWidths.filter((width) => {
                for (let i = options.imageWidths.length - 1; i >= 0; i -= 1) {
                    if (width.key === options.imageWidths[i]) {
                        return true;
                    }
                }
                return false;
            });
        }
        img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;
            if (imgHeight < minHeight) {
                reject(
                    `Image height is smaller than minimum allowed of ${minHeight} pixels`
                );
            } else if (imgWidth < minWidth) {
                reject(
                    `Image width is smaller than minimum allowed of ${minWidth} pixels`
                );
            }
            const aspectRatio = imgWidth / imgHeight;
            for (let i = resizeWidths.length - 1; i >= 0; i -= 1) {
                if (img.width >= resizeWidths[i].res) {
                    availableWidths.push(resizeWidths[i]);
                }
            }
            const blobsPromise = [];
            for (let i = availableWidths.length - 1; i >= 0; i -= 1) {
                canvas.width = availableWidths[i].res;
                canvas.height = availableWidths[i].res / aspectRatio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                blobsPromise.push(convertToBlob(canvas, availableWidths[i]));
            }
            Promise.all(blobsPromise).then((imageArray) => {
                // an imageArray contains an object for each available key
                // [{key: 'sm', width: 320, ....}]
                const imageObj = {};
                imageArray.forEach((imgObj) => {
                    imageObj[imgObj.key] = {
                        src: imgObj.src,
                        width: imgObj.width,
                        height: imgObj.height
                    };
                });
                return resolve(imageObj);
            });
        };
        img.src = imagePath;
    });
}
/**
 * Utility to resize images using Html5 canvas
 * @param {Array} imagePaths Path(s) returned from a dialog window
 * @param {Object} options
 * @param {Number} options.minHeight Minimum allowed height
 * @param {Number} options.minWidth Minimum allowed width
 * @param {Array} options.imageWidths Resize using keys in this array only
 * @returns {Array} promises Array of promises for each passed path
 *
 * @example
 *  const filePromises = getResizedImages([/path/to/image.jpg, /path/to/image2.png], {
 *       minWidth: 250,
 *       minHeight: 200,
 *  });
 *   Promise.all(filePromises).then(results =>
 *       results.forEach(result => {
 *          result is an array containing all image variants for a given path
 *          result[0].dataUrl {base64 imageData}
 *          result[0].height  {resulting height after resize}
 *          result[0].width   {resulting width after resize}
 *          result[0].key     {key}
 *       });
 *   ).catch(reason => reason {string} 'Image height is smaller than minimum allowed of 200 pixels')
 */
function getResizedImages (imagePaths, options) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const promises = [];
    for (let i = imagePaths.length - 1; i >= 0; i--) {
        const path = imagePaths[i];
        promises.push(readImageData(path, canvas, ctx, options));
    }
    return promises;
}

export default imageCreator;
export { getResizedImages, extractImageFromContent, findBestMatch, findClosestMatch };
