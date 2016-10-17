import BaseService from './base-service';

class AppService extends BaseService {
    checkForUpdates = () =>
        new Promise((resolve, reject) => {
            return resolve({ hasUpdates: false });
        });
    updateApp = () =>
        new Promise((resolve, reject) => {
            return resolve({ success: true });
        })
}

export { AppService };
