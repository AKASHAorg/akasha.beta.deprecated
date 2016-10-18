import * as Colors from 'material-ui/styles/colors';
import * as colorManipulator from 'material-ui/utils/colorManipulator';
import { spacing, zIndex } from 'material-ui/styles';

export default {
    spacing,
    zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#03A9F4',
        textColor: Colors.lightBlack,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: colorManipulator.fade(Colors.darkBlack, 0.3),
        pickerHeaderColor: Colors.cyan500,
        accent1Color: Colors.red500,
        accent2Color: Colors.amber500,
        accent3Color: Colors.green500,
        paperShadowColor: Colors.grey400
    },
    imageUploader: {
        position: 'relative',
        border: `1px solid ${Colors.lightBlack}`
    }
};
