import {module as userModule} from './auth/index';
import {module as profileModule} from './profile/index';

export function initModules() {
    userModule.init();
}

export function initIpfsModules() {
    profileModule.init();
}

