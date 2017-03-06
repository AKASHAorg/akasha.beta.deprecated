import * as Colors from 'material-ui/styles/colors';
import * as colorManipulator from 'material-ui/utils/colorManipulator';
import { spacing, zIndex } from 'material-ui/styles';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

const darkTheme = {
    spacing,
    zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: Object.assign({}, darkBaseTheme.palette, {
        primary1Color: '#4285f4',
        borderColor: Colors.grey700,
        accent1Color: '#c82506',
        accent2Color: '#de6a10',
        accent3Color: '#70bf41',
        paperShadowColor: Colors.grey800,
        tutorialsBackgroundColor: '#252525',
    }),
    imageUploader: {
        position: 'relative',
        border: `1px solid ${Colors.lightBlack}`
    }
};

export default darkTheme;
