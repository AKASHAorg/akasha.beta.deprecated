"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const electron_1 = require('electron');
let menu;
let template;
const installExtensions = () => __awaiter(this, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'development') {
        const installer = require('electron-devtools-installer');
        const extensions = [
            'REACT_DEVELOPER_TOOLS',
            'REDUX_DEVTOOLS'
        ];
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        for (const name of extensions) {
            try {
                yield installer.default(installer[name], forceDownload);
            }
            catch (e) {
            }
        }
    }
});
function initMenu(mainWindow) {
    return __awaiter(this, void 0, void 0, function* () {
        yield installExtensions();
        if (process.env.NODE_ENV === 'development') {
            mainWindow.openDevTools();
            mainWindow.webContents.on('context-menu', (e, props) => {
                const { x, y } = props;
                electron_1.Menu.buildFromTemplate([{
                        label: 'Inspect element',
                        click() {
                            mainWindow.inspectElement(x, y);
                        }
                    }]).popup(mainWindow);
            });
        }
        mainWindow.setMenu(null);
    });
}
exports.initMenu = initMenu;
//# sourceMappingURL=menu.js.map