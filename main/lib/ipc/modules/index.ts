import { module as userModule } from './auth/index';

export function initModules() {
    if (!userModule.auth) {
        userModule.init();
    }
}

