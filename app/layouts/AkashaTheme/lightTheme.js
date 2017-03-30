import * as Colors from 'material-ui/styles/colors';
import { spacing, zIndex } from 'material-ui/styles';

export default {
    spacing,
    zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#4285f4',
        textColor: '#4c4c4c',
        secondaryTextColor: '#757575',
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: '#999999',
        pickerHeaderColor: Colors.cyan500,
        accent1Color: '#c82506',
        accent2Color: '#de6a10',
        accent3Color: '#70bf41',
        paperShadowColor: Colors.grey400,
        commentAuthorColor: Colors.grey800,
        commentViewerIsAuthorColor: Colors.blueA400,
        commentIsEntryAuthorColor: Colors.greenA700,
        avatarBackground: Colors.grey50,
        errorColor: Colors.orange900,
        linkColor: '#008B8B',
        themeColor: '#f0f0f0',
    },
    imageUploader: {
        position: 'relative',
        border: `1px solid ${Colors.lightBlack}`
    }
};
