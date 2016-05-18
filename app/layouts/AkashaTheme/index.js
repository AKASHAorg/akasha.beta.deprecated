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
        pickerHeaderColor: Colors.cyan500
    },
    imageUploader: {
        position: 'relative',
        border: `1px solid ${Colors.lightBlack}`,
        
    }
};
