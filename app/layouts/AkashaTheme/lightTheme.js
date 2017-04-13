import * as Colors from 'material-ui/styles/colors';
import { spacing, zIndex } from 'material-ui/styles';

export default {
    spacing,
    zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        accent1Color: '#c82506',
        accent2Color: '#de6a10',
        accent3Color: '#70bf41',
        alternateTextColor: Colors.white,
        avatarBackground: Colors.grey50,
        borderColor: Colors.grey300,
        canvasColor: Colors.white,
        commentAuthorColor: Colors.grey800,
        commentIsEntryAuthorColor: Colors.greenA700,
        commentViewerIsAuthorColor: Colors.blueA400,
        disabledColor: '#999999',
        errorColor: Colors.orange900,
        linkColor: '#008B8B',
        paperShadowColor: Colors.grey400,
        pickerHeaderColor: Colors.cyan500,
        primary1Color: '#4285f4',
        secondaryTextColor: '#757575',
        sidebarColor: '#f3f3f3',
        textColor: '#4c4c4c',
        themeColor: '#f0f0f0',
    },
    imageUploader: {
        position: 'relative',
        border: `1px solid ${Colors.lightBlack}`
    },
    slider: {
        trackColorSelected: Colors.grey400
    }
};
