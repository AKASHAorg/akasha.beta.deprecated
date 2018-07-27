import ModuleEmitter from '../event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from '../event/responses';
import { getLicence, LicencesList } from './models/Licenses';
import WebContents = Electron.WebContents;

class LicensesIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'licenses';
        this.DEFAULT_MANAGED = ['getLicenceById'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this
            ._getLicenses()
            ._getLicenceById()
            ._manager();
    }

    private _getLicenses() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getLicenses,
            (event: any, data: any) => {
                const response = mainResponse({ licenses: LicencesList }, data);
                this.fireEvent(
                    channels.client[this.MODULE_NAME].getLicenses,
                    response,
                    event
                );
            }
        );
        return this;
    }

    private _getLicenceById() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getLicenceById,
            (event: any, data: { id: string | number }) => {
                const response = mainResponse({ license: getLicence(data.id) }, data);
                this.fireEvent(
                    channels.client[this.MODULE_NAME].getLicenceById,
                    response,
                    event
                );
            }
        );
        return this;
    }
}

export default LicensesIPC;
