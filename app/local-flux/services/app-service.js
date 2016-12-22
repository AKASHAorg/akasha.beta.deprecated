import BaseService from './base-service';

class AppService extends BaseService {
    checkForUpdates = () =>
        new Promise(resolve =>
            resolve({ hasUpdates: false })
        );
    updateApp = () =>
        new Promise(resolve =>
            resolve({ success: true })
        )
}

export { AppService };
