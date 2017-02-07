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
        const version = electron_1.app.getVersion();
        const template = [
            {
                label: 'Edit',
                submenu: [
                    {
                        role: 'undo'
                    },
                    {
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'cut'
                    },
                    {
                        role: 'copy'
                    },
                    {
                        role: 'paste'
                    },
                    {
                        role: 'pasteandmatchstyle'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'delete'
                    },
                    {
                        role: 'selectall'
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        role: 'reload'
                    },
                    {
                        role: 'togglefullscreen'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'resetzoom'
                    },
                    {
                        role: 'zoomin'
                    },
                    {
                        role: 'zoomout'
                    }
                ]
            },
            {
                role: 'window',
                submenu: [
                    {
                        role: 'minimize'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            electron_1.shell.openExternal('https://github.com/AkashaProject/Alpha/wiki/FAQ');
                        }
                    },
                    {
                        label: 'Report Issue',
                        click() {
                            electron_1.shell.openExternal('https://github.com/AkashaProject/Alpha/issues/new');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Clear Cache',
                        click() {
                            electron_1.session.defaultSession.clearCache(function () {
                                console.log('cleared cache');
                            });
                        }
                    },
                    {
                        label: 'Reset App Data',
                        click() {
                            electron_1.session.defaultSession.clearStorageData(function () {
                                console.log('cleared storage app data');
                            });
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'About AKASHA',
                        click() {
                            electron_1.shell.openExternal('http://akasha.world');
                        }
                    },
                    {
                        label: `Version ${version}`
                    }
                ]
            }
        ];
        if (process.platform === 'darwin') {
            template.unshift({
                label: electron_1.app.getName(),
                submenu: [
                    {
                        role: 'about'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'hide'
                    },
                    {
                        role: 'hideothers'
                    },
                    {
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'quit'
                    }
                ]
            });
            template[3].submenu = [
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: 'Zoom',
                    role: 'zoom'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                }
            ];
        }
        const menu = electron_1.Menu.buildFromTemplate(template);
        electron_1.Menu.setApplicationMenu(menu);
    });
}
exports.initMenu = initMenu;
//# sourceMappingURL=menu.js.map