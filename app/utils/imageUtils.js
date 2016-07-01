import r from 'ramda';

function imageCreator (arrayBuffer, { mimeType = 'image/png', width = 100, height = 100 } = {}) {
    const blobFile = new Blob([arrayBuffer], { type: mimeType });
    const imageUrl = window.URL.createObjectURL(blobFile);
    const image = new Image(width, height);
    image.onload = function onload () {
        window.URL.revokeObjectURL(imageUrl);
    };
    image.src = imageUrl;
    return image;
}


/**
 * @TODO Move this to a config file
 */
const imageWidths = [
    {
        key: 'xlarge',
        res: '1920'
    }, {
        key: 'mlarge',
        res: '1280'
    }, {
        key: 'large',
        res: '1024'
    }, {
        key: 'xmed',
        res: '768'
    }, {
        key: 'med',
        res: '640'
    }, {
        key: 'small',
        res: '320'
    }
];

function _readImageData (imagePath, canvas, ctx, options) {
    return new Promise((resolve, reject) => {
        const availableWidths = [];
        let resizeWidths = imageWidths;
        const img = new Image();
        const { minWidth, minHeight } = options;
        if (options.imageWidths) {
            resizeWidths = imageWidths.filter((width) => {
                for (let i = options.imageWidths.length - 1; i >= 0; i--) {
                    if (width.key === options.imageWidths[i]) {
                        return true;
                    }
                }
                return false;
            });
        }
        img.onload = () => {
            const images = [];
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
            const aspectRatio = imgHeight > imgWidth ? imgHeight / imgWidth : imgWidth / imgHeight;

            for (let i = resizeWidths.length - 1; i >= 0; i--) {
                if (img.width >= resizeWidths[i].res) {
                    availableWidths.push(resizeWidths[i]);
                }
            }
            const blobCb = (width, canvasWidth, canvasHeight) =>
                (blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        images.push(
                            {
                                key: width.key,
                                imageFile: new Uint8Array(reader.result),
                                width: canvasWidth,
                                height: canvasHeight
                            }
                        );
                    };
                    reader.readAsArrayBuffer(blob);
                };
            r.forEach(width => {
                canvas.width = width.res;
                canvas.height = width.res / aspectRatio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blobCb(width, canvas.width, canvas.height), 'image/jpg');
            }, availableWidths);
            resolve(images);
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
 * @return {Array} promises Array of promises for each passed path
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
        promises.push(_readImageData(path, canvas, ctx, options));
    }
    return promises;
}

export default imageCreator;
export { getResizedImages };
