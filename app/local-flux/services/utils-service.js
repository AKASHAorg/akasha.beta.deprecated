const Channel = global.Channel;

// export const backupKeys = ({ target, onSuccess, onError }) => {
//     const clientChannel = Channel.client.utils.backupKeys;
//     const serverChannel = Channel.server.utils.backupKeys;
//     this.openChannel({
//         clientManager: this.clientManager,
//         serverChannel,
//         clientChannel,
//         listenerCb: this.createListener(
//             onError,
//             onSuccess,
//             clientChannel.channelName
//         )
//     }, () => {
//         serverChannel.send({ target });
//     });
// };

export const uploadImage = (files, imgId) => {
    const serverChannel = window.Channel.server.utils.uploadImage;
    const clientChannel = window.Channel.client.utils.uploadImage;
    const managerChannel = window.Channel.client.utils.manager;
    console.log(files, 'the files to convert');

    return new Promise((resolve, reject) => {
        clientChannel.once((ev, { data }) => {
            if (data.error) return reject(data.error);
            const filesArr = data.collection;
            filesArr.forEach((file) => {
                files[file.size].src = file.hash;
            });
            console.log(files, 'the new files with ipfs hash');
            return resolve(files);
        });
        managerChannel.once(() => {
            serverChannel.send(
                Object.keys(files)
                    .map(fileKey => ({
                        size: fileKey,
                        id: imgId,
                        source: files[fileKey].src
                    })));
        });
        serverChannel.enable();
    });
};
