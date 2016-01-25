import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export default {
  spacing:    Spacing,
  zIndex:     zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette:    {
    primary1Color:      '#03A9F4',
    primary2Color:      '#29B6F6',
    primary3Color:      '#4FC3F7',
    accent1Color:       '#80D8FF',
    accent2Color:       '#40C4FF',
    accent3Color:       '#00B0FF',
    textColor:          '#efefef',
    alternateTextColor: Colors.white,
    canvasColor:        Colors.white,
    borderColor:        Colors.grey300,
    disabledColor:      ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor:  Colors.cyan500
  }
};
