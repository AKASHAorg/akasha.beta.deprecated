import * as Colors from 'material-ui/styles/colors';
import * as colorManipulator from 'material-ui/utils/colorManipulator';
import { spacing, zIndex } from 'material-ui/styles';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

const darkTheme = {
    spacing,
    zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: Object.assign({}, darkBaseTheme.palette, {
        borderColor: Colors.grey700,
        accent1Color: Colors.red700,
        accent2Color: Colors.amber700,
        accent3Color: Colors.green700,
        paperShadowColor: Colors.grey800
    }),
    imageUploader: {
        position: 'relative',
        border: `1px solid ${Colors.lightBlack}`
    }
};

export default darkTheme;
