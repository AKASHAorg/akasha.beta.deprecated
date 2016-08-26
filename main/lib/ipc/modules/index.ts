import {module as userModule} from './user/index';

export function initModules() {
    userModule.init();
}
