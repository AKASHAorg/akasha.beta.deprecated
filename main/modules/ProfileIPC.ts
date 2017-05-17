import ModuleEmitter from '../event/ModuleEmitter';
import profile from './profile/index';
import WebContents = Electron.WebContents;

class ProfileIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'profile';
        this.DEFAULT_MANAGED = ['getProfileData', 'getBalance'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(profile);
        this._manager();
    }

}

export default ProfileIPC;
