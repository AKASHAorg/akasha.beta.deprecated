import { app, dialog, autoUpdater } from 'electron';
import Logger from './modules/Logger';

export default function appUpdater() {

    const log = Logger.getInstance().registerLogger('updater');
    autoUpdater.on('error', err => log.err(err));
    autoUpdater.on('checking-for-update', () => log.info('checking-for-update'));
    autoUpdater.on('update-available', () => log.info('update-available'));
    autoUpdater.on('update-not-available', () => log.info('update-not-available'));

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/);
            message += '\n\nRelease notes:\n';
            splitNotes.forEach(notes => {
                message += notes + '\n\n';
            });
        }
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Install and Relaunch', 'Later'],
            defaultId: 0,
            message: 'A new version of ' + app.getName() + ' has been downloaded',
            detail: message
        }, response => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1);
            }
        });
    });
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60000);
}
