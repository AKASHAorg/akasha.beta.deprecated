"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Promise = require("bluebird");
const installExtensions = async () => {
    return Promise.resolve();
};
async function initMenu(mainWindow) {
    await installExtensions();
    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
        mainWindow.webContents.on('context-menu', (e, props) => {
            const { x, y } = props;
            electron_1.Menu.buildFromTemplate([{
                    label: 'Inspect element',
                    click() {
                        mainWindow.inspectElement(x, y);
                    },
                }]).popup(mainWindow);
        });
    }
    const version = electron_1.app.getVersion();
    const template = [
        {
            label: 'Edit',
            submenu: [
                {
                    role: 'undo',
                },
                {
                    role: 'redo',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'cut',
                },
                {
                    role: 'copy',
                },
                {
                    role: 'paste',
                },
                {
                    role: 'pasteandmatchstyle',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'delete',
                },
                {
                    role: 'selectall',
                },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload',
                },
                {
                    role: 'togglefullscreen',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'resetzoom',
                },
                {
                    role: 'zoomin',
                },
                {
                    role: 'zoomout',
                },
            ],
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize',
                },
                {
                    role: 'close',
                },
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        electron_1.shell.openExternal('http://akasha.helpscoutdocs.com/');
                    },
                },
                {
                    label: 'Report Issue',
                    click() {
                        electron_1.shell.openExternal('https://github.com/AkashaProject/dapp/issues/new');
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Clear Cache',
                    click() {
                        electron_1.session.defaultSession.clearCache(function () {
                            console.log('cleared cache');
                        });
                    },
                },
                {
                    label: 'Reset App Data',
                    click() {
                        electron_1.session.defaultSession.clearStorageData(null, function () {
                            console.log('cleared storage app data');
                        });
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'About AKASHA',
                    click() {
                        electron_1.shell.openExternal('http://akasha.world');
                    },
                },
                {
                    label: `Version ${version}`,
                },
            ],
        },
    ];
    if (process.platform === 'darwin') {
        template.unshift({
            label: electron_1.app.getName(),
            submenu: [
                {
                    role: 'about',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'services',
                    submenu: [],
                },
                {
                    type: 'separator',
                },
                {
                    role: 'hide',
                },
                {
                    role: 'hideothers',
                },
                {
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'quit',
                },
            ],
        });
        template[3].submenu = [
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close',
            },
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize',
            },
            {
                label: 'Zoom',
                role: 'zoom',
            },
            {
                type: 'separator',
            },
            {
                label: 'Bring All to Front',
                role: 'front',
            },
        ];
    }
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
exports.initMenu = initMenu;
//# sourceMappingURL=menu.js.map