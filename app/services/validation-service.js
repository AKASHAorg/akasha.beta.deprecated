const { ipcRenderer } = require('electron');

class ValidationService {
    validateUsername (username) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('username:validate', username);
            ipcRenderer.on('username:validated', (event, data) => {
                if (!data) {
                    return reject('Service Unavailable!');
                }
                return resolve(data);
            });
        });
    }
}

export { ValidationService };
