import { module as userModule } from './auth/index';
import { module as profileModule } from './profile/index';

export function initModules() {
    if(!userModule.auth){
        userModule.init();
    }
}

export function initIpfsModules() {
    if(!profileModule.helpers){
        profileModule.init();
    }
}

