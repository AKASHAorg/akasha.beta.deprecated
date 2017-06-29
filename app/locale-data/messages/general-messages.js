import { defineMessages } from 'react-intl';

// keep this sorted alphabetically
const generalMessages = defineMessages({
    abort: {
        id: 'app.general.abort',
        description: 'abort button label',
        defaultMessage: 'Abort'
    },
    addImage: {
        id: 'app.general.addImage',
        description: 'Add image',
        defaultMessage: 'Add image'
    },
    addNewEntry: {
        id: 'app.general.addNewEntry',
        description: 'tooltip for sidebar add entry button',
        defaultMessage: 'Add new entry'
    },
    aeth: {
        id: 'app.general.aeth',
        description: 'aeth token',
        defaultMessage: 'AETH'
    },
    akasha: {
        id: 'app.general.akasha',
        description: 'AKASHA',
        defaultMessage: 'AKASHA'
    },
    back: {
        id: 'app.general.back',
        description: 'navigate back',
        defaultMessage: 'Back'
    },
    backup: {
        id: 'app.general.backup',
        description: 'backup button label',
        defaultMessage: 'Backup'
    },
    by: {
        id: 'app.general.by',
        description: 'entry is written `by`',
        defaultMessage: 'by'
    },
    cancel: {
        id: 'app.general.cancel',
        description: 'cancel button label',
        defaultMessage: 'Cancel'
    },
    chat: {
        id: 'app.general.chat',
        description: 'tooltip for sidebar chat button',
        defaultMessage: 'Chat'
    },
    comingSoon: {
        id: 'app.general.comingSoon',
        description: 'tooltip for sidebar disabled button',
        defaultMessage: 'Coming soon'
    },
    completed: {
        id: 'app.general.completed',
        description: 'completed button label',
        defaultMessage: 'Completed'
    },
    confirm: {
        id: 'app.general.confirm',
        description: 'confirm button label',
        defaultMessage: 'Confirm'
    },
    connected: {
        id: 'app.general.connected',
        description: 'connected status',
        defaultMessage: 'connected'
    },
    createNewIdentityLabel: {
        id: 'app.general.createIdentityLabel',
        description: 'Create identity button label',
        defaultMessage: 'Create identity'
    },
    resumeIdentityLabel: {
        id: 'app.general.resumeIdentityLabel',
        description: 'resume identity button label',
        defaultMessage: 'Resume Identity'
    },
    close: {
        id: 'app.general.close',
        description: 'close',
        defaultMessage: 'Close'
    },
    delete: {
        id: 'app.general.delete',
        description: 'Delete something button label',
        defaultMessage: 'Delete'
    },
    downloading: {
        id: 'app.general.downloading',
        description: 'service status',
        defaultMessage: 'Downloading'
    },
    edit: {
        id: 'app.general.edit',
        description: 'Edit something button label',
        defaultMessage: 'Edit'
    },
    ethereumAddress: {
        id: 'app.general.ethereumAddress',
        description: 'Placeholder for ethereum address field. Not sure if Ethereum should be translated',
        defaultMessage: 'Ethereum Address'
    },
    gethServiceOff: {
        id: 'app.general.gethServiceOff',
        description: 'geth client service is stopped',
        defaultMessage: 'Geth service OFF'
    },
    gethServiceOn: {
        id: 'app.general.gethServiceOn',
        description: 'geth client service is started',
        defaultMessage: 'Geth service ON'
    },
    help: {
        id: 'app.general.help',
        description: 'Help button label',
        defaultMessage: 'Help'
    },
    hoursCount: {
        id: 'app.general.hoursCount',
        description: 'hours count',
        defaultMessage: `{hours, number} {hours, plural,
            one {hour}
            other {hours}
        }`
    },
    importIdentityLabel: {
        id: 'app.general.importIdentityLabel',
        description: 'Import identity button label',
        defaultMessage: 'Import identity'
    },
    ipfsServiceOff: {
        id: 'app.general.ipfsServiceOff',
        description: 'ipfs client service is stopped',
        defaultMessage: 'IPFS service OFF'
    },
    ipfsServiceOn: {
        id: 'app.general.ipfsServiceOn',
        description: 'ipfs client service is started',
        defaultMessage: 'IPFS service ON'
    },
    join: {
        id: 'app.general.join',
        description: 'join button label',
        defaultMessage: 'Join'
    },
    leave: {
        id: 'app.general.leave',
        description: 'leave button label',
        defaultMessage: 'Leave'
    },
    logs: {
        id: 'app.general.logs',
        description: 'Services logs',
        defaultMessage: 'Logs'
    },
    minCount: {
        id: 'app.general.minutesCount',
        description: 'short form of minutes count',
        defaultMessage: '{minutes, number} min'
    },
    myEntries: {
        id: 'app.general.myEntries',
        description: 'tooltip for sidebar my entries button',
        defaultMessage: 'My entries'
    },
    nextButtonLabel: {
        id: 'app.general.nextButtonLabel',
        description: 'Label for Next button',
        defaultMessage: 'Next'
    },
    noErrors: {
        id: 'app.general.noErrors',
        description: 'placeholder for empty error list',
        defaultMessage: 'No errors'
    },
    ok: {
        id: 'app.general.ok',
        description: 'Ok',
        defaultMessage: 'Ok'
    },
    pause: {
        id: 'app.general.pause',
        description: 'pause button label',
        defaultMessage: 'Pause'
    },
    people: {
        id: 'app.general.people',
        description: 'tooltip for sidebar people button',
        defaultMessage: 'People'
    },
    publish: {
        id: 'app.general.publish',
        description: 'button label for publish action',
        defaultMessage: 'Publish'
    },
    refresh: {
        id: 'app.general.refresh',
        description: 'refresh button label',
        defaultMessage: 'Refresh'
    },
    reset: {
        id: 'app.general.reset',
        description: 'Reset form',
        defaultMessage: 'Reset'
    },
    resume: {
        id: 'app.general.resume',
        description: 'resume button label',
        defaultMessage: 'Resume'
    },
    running: {
        id: 'app.general.running',
        description: 'service status',
        defaultMessage: 'Running'
    },
    save: {
        id: 'app.general.save',
        description: 'Save changes in a form',
        defaultMessage: 'Save'
    },
    search: {
        id: 'app.general.search',
        description: 'tooltip for sidebar search button',
        defaultMessage: 'Search'
    },
    sendFeedback: {
        id: 'app.general.sendFeedback',
        description: 'send feedback button label',
        defaultMessage: 'Send feedback'
    },
    serviceStoppedWarning: {
        id: 'app.createProfile.serviceStoppedWarning',
        description: 'message to be displayed when geth and/or IPFS are/is stopped',
        defaultMessage: 'Geth and IPFS must be started'
    },
    settings: {
        id: 'app.general.settings',
        description: 'settings button label',
        defaultMessage: 'Settings'
    },
    showMore: {
        id: 'app.general.showMore',
        description: 'label for button that loads more data',
        defaultMessage: 'Show more'
    },
    signOut: {
        id: 'app.general.signOut',
        description: 'sign out button label',
        defaultMessage: 'Sign out'
    },
    start: {
        id: 'app.general.start',
        description: 'start button label',
        defaultMessage: 'Start'
    },
    starting: {
        id: 'app.general.starting',
        description: 'service status',
        defaultMessage: 'Starting'
    },
    stopped: {
        id: 'app.general.stopped',
        description: 'service status',
        defaultMessage: 'Stopped'
    },
    stream: {
        id: 'app.general.stream',
        description: 'tooltip for sidebar stream button',
        defaultMessage: 'Stream'
    },
    submit: {
        id: 'app.general.submit',
        description: 'submit button label',
        defaultMessage: 'Submit'
    },
    termsOfService: {
        id: 'app.general.termsOfService',
        description: 'Terms of Service and Privacy Policy',
        defaultMessage: 'Terms of Service and Privacy Policy'
    },
    update: {
        id: 'app.general.update',
        description: 'Update data',
        defaultMessage: 'Update'
    },
    upgrading: {
        id: 'app.general.upgrading',
        description: 'Upgrading services',
        defaultMessage: 'Upgrading'
    }
});
export { generalMessages };
