import _ from 'lodash';
import linkState from './linkState';

const inputFieldMethods = {
  getProps (componentInstance, params) {
    const props = _.omit(params, ['statePath', 'addValueLink']);
    const validationErrors = componentInstance.props.getValidationMessages(params.statePath);

    if (params.statePath && params.addValueLink) {
      props.valueLink = linkState.call(componentInstance, params.statePath);
    }

    if (validationErrors.length > 0) {
      props.errorText = validationErrors.reduce((prev, current) => `${prev}, ${current}`);
    }
    return props;
  }
};

export default {
  inputFieldMethods
};
