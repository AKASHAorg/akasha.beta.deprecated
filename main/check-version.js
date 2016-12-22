"use strict";
const electron_1 = require('electron');
const compareVersions = require('compare-versions');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
class UpdateChecker {
    setWindow(activeWindow) {
        this.browserWindow = activeWindow;
        this.currentVersion = electron_1.app.getVersion();
    }
    checkVersion(version, repo, changeLog) {
        if (compareVersions(version, this.currentVersion) === 1) {
            this.emitDialog(version, repo, changeLog);
            return true;
        }
        return false;
    }
    emitDialog(version, repo, changeLog) {
        ipfs_connector_1.IpfsConnector.getInstance().api.get(changeLog).then((changeLogData) => {
            electron_1.dialog.showMessageBox(this.browserWindow, {
                type: 'info',
                title: 'AKASHA',
                buttons: ['Cancel', 'Download'],
                message: `A new version is available: ${version}`,
                detail: `
Changelog: 
${changeLogData}

Source: 
${repo}
`
            }, (cb) => {
                if (cb === 1) {
                    electron_1.shell.openExternal(repo);
                }
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new UpdateChecker();
//# sourceMappingURL=check-version.js.map