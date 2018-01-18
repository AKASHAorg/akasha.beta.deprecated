import { app, dialog, autoUpdater } from 'electron';

export default function appUpdater() {
    autoUpdater.on('error', err => console.log(err));
    autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
    autoUpdater.on('update-available', () => console.log('update-available'));
    autoUpdater.on('update-not-available', () => console.log('update-not-available'));

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
    autoUpdater.checkForUpdates();
}
