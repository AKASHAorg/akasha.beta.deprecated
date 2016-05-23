const { ipcRenderer } = require('electron');

class AppSettingsService {
    saveSettings (appSettings) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('appSettings:save', appSettings);
            ipcRenderer.on('appSettings:saved', (event, data) => {
                if (!data) {
                    return reject('Service Unavailable');
                }
                return resolve(data);
            });
        });
    }
}
export { AppSettingsService };
