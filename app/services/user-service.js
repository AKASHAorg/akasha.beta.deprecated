const { ipcRenderer } = require('electron');


class UserService {
    create (userData) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('user:create', userData);
            ipcRenderer.on('user:created', (event, arg) => {
                if (arg.error) {
                    return reject(arg.error);
                }
                return resolve(arg);
            });
        });
    }
}

export { UserService };
