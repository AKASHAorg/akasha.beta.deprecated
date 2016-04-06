const remote = require('electron').remote;
const ipfsRemote = remote.getGlobal('ipfsInstance');

function imageCreator(arrayBuffer, { mimeType = 'image/png', width = 100, height = 100 } = {}) {
  const blobFile = new Blob([arrayBuffer], { type: mimeType });
  const imageUrl = window.URL.createObjectURL(blobFile);
  const image = new Image(width, height);
  image.src = imageUrl;
  return image;
}

function getIpfsImage(hash, { mimeType = 'image/png', width = 100, height = 100 } = {}) {
  return ipfsRemote.cat(hash, false).then(
    data => imageCreator(data, { mimeType, width, height })
  ).catch((err) => {throw new Error(err);});
}

export default imageCreator;
export { getIpfsImage };
