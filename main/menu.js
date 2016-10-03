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
        if (process.platform === 'darwin') {
            template = [{
                    label: 'Electron',
                    submenu: [{
                            label: 'About ElectronReact',
                            selector: 'orderFrontStandardAboutPanel:'
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Services',
                            submenu: []
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Hide ElectronReact',
                            accelerator: 'Command+H',
                            selector: 'hide:'
                        }, {
                            label: 'Hide Others',
                            accelerator: 'Command+Shift+H',
                            selector: 'hideOtherApplications:'
                        }, {
                            label: 'Show All',
                            selector: 'unhideAllApplications:'
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Quit',
                            accelerator: 'Command+Q',
                            click() {
                                electron_1.app.quit();
                            }
                        }]
                }, {
                    label: 'Edit',
                    submenu: [{
                            label: 'Undo',
                            accelerator: 'Command+Z',
                            selector: 'undo:'
                        }, {
                            label: 'Redo',
                            accelerator: 'Shift+Command+Z',
                            selector: 'redo:'
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Cut',
                            accelerator: 'Command+X',
                            selector: 'cut:'
                        }, {
                            label: 'Copy',
                            accelerator: 'Command+C',
                            selector: 'copy:'
                        }, {
                            label: 'Paste',
                            accelerator: 'Command+V',
                            selector: 'paste:'
                        }, {
                            label: 'Select All',
                            accelerator: 'Command+A',
                            selector: 'selectAll:'
                        }]
                }, {
                    label: 'View',
                    submenu: (process.env.NODE_ENV === 'development') ? [{
                            label: 'Reload',
                            accelerator: 'Command+R',
                            click() {
                                mainWindow.webContents.reload();
                            }
                        }, {
                            label: 'Toggle Full Screen',
                            accelerator: 'Ctrl+Command+F',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        }, {
                            label: 'Toggle Developer Tools',
                            accelerator: 'Alt+Command+I',
                            click() {
                                mainWindow.toggleDevTools();
                            }
                        }] : [{
                            label: 'Toggle Full Screen',
                            accelerator: 'Ctrl+Command+F',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        }]
                }, {
                    label: 'Window',
                    submenu: [{
                            label: 'Minimize',
                            accelerator: 'Command+M',
                            selector: 'performMiniaturize:'
                        }, {
                            label: 'Close',
                            accelerator: 'Command+W',
                            selector: 'performClose:'
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Bring All to Front',
                            selector: 'arrangeInFront:'
                        }]
                }, {
                    label: 'Help',
                    submenu: [{
                            label: 'Learn More',
                            click() {
                                electron_1.shell.openExternal('http://electron.atom.io');
                            }
                        }, {
                            label: 'Documentation',
                            click() {
                                electron_1.shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                            }
                        }, {
                            label: 'Community Discussions',
                            click() {
                                electron_1.shell.openExternal('https://discuss.atom.io/c/electron');
                            }
                        }, {
                            label: 'Search Issues',
                            click() {
                                electron_1.shell.openExternal('https://github.com/atom/electron/issues');
                            }
                        }]
                }];
            menu = electron_1.Menu.buildFromTemplate(template);
            electron_1.Menu.setApplicationMenu(menu);
        }
        else {
            template = [{
                    label: '&File',
                    submenu: [{
                            label: '&Open',
                            accelerator: 'Ctrl+O'
                        }, {
                            label: '&Close',
                            accelerator: 'Ctrl+W',
                            click() {
                                mainWindow.close();
                            }
                        }]
                }, {
                    label: '&View',
                    submenu: (process.env.NODE_ENV === 'development') ? [{
                            label: '&Reload',
                            accelerator: 'Ctrl+R',
                            click() {
                                mainWindow.webContents.reload();
                            }
                        }, {
                            label: 'Toggle &Full Screen',
                            accelerator: 'F11',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        }, {
                            label: 'Toggle &Developer Tools',
                            accelerator: 'Alt+Ctrl+I',
                            click() {
                                mainWindow.toggleDevTools();
                            }
                        }] : [{
                            label: 'Toggle &Full Screen',
                            accelerator: 'F11',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        }]
                }, {
                    label: 'Help',
                    submenu: [{
                            label: 'Learn More',
                            click() {
                                electron_1.shell.openExternal('http://electron.atom.io');
                            }
                        }, {
                            label: 'Documentation',
                            click() {
                                electron_1.shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                            }
                        }, {
                            label: 'Community Discussions',
                            click() {
                                electron_1.shell.openExternal('https://discuss.atom.io/c/electron');
                            }
                        }, {
                            label: 'Search Issues',
                            click() {
                                electron_1.shell.openExternal('https://github.com/atom/electron/issues');
                            }
                        }]
                }];
            menu = electron_1.Menu.buildFromTemplate(template);
            mainWindow.setMenu(menu);
        }
    });
}
exports.initMenu = initMenu;
//# sourceMappingURL=menu.js.map