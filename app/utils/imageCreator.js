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

export default imageCreator;
export { getIpfsImage };
