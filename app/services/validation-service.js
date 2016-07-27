import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';

class ValidationService {
    validateUsername = (userName) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.exists, (ev, data) => {
                if (!data) {
                    const error = new Error('No message from main process!');
                    return reject(error);
                }
                return resolve(data);
            });
            ipcRenderer.send(EVENTS.server.user.exists, { userName });
        });
}
export { ValidationService };
