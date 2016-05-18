import _ from 'lodash';

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

function getIpfsImage (hash, { mimeType = 'image/png', width = 100, height = 100 } = {}) {
    return window.ipfsInstance.cat(hash, false).then(
        data => imageCreator(data, { mimeType, width, height })
    ).catch(() => false);
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
        const img = new Image();
        const { minWidth, minHeight } = options;
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

            for (let i = imageWidths.length - 1; i >= 0; i--) {
                if (img.width >= imageWidths[i].res) {
                    availableWidths.push(imageWidths[i]);
                }
            }
            _.forEach(availableWidths, width => {
                canvas.width = width.res;
                canvas.height = width.res / aspectRatio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL();
                images.push(
                    {
                        key: width.key,
                        dataURL: imageData,
                        width: canvas.width,
                        height: canvas.height
                    }
                );
            });
            resolve(images);
        };
        img.src = imagePath;
    });
}

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
export { getIpfsImage, getResizedImages };
