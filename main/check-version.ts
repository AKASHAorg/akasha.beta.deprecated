import { dialog, shell, app } from 'electron';
import * as compareVersions from 'compare-versions';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

class UpdateChecker {
    browserWindow: any;
    currentVersion: string;

    public setWindow(activeWindow) {
        this.browserWindow = activeWindow;
        this.currentVersion = app.getVersion();
    }

    checkVersion(version: string, repo: string, changeLog: string) {
        if (compareVersions(version, this.currentVersion) === 1) {
            this.emitDialog(version, repo, changeLog);
            return true;
        }
        return false;
    }

    private emitDialog(version, repo, changeLog) {
        IpfsConnector.getInstance().api.get(changeLog).then((changeLogData) => {
            dialog.showMessageBox(this.browserWindow, {
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
                    shell.openExternal(repo);
                }
            })
        });
    }
}

export default new UpdateChecker();
