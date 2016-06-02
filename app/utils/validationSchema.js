import strategy from 'react-validatorjs-strategy';
import { formMessages, validationMessages } from '../locale-data/messages';

class UserValidation {
    constructor (intl) {
        this.intl = intl;
    }
    getSchema () {
        const { formatMessage } = this.intl;
        return strategy.createSchema({
            firstName: 'required|min:3',
            lastName: 'required|min:3',
            userName: 'required|min:4',
            password: 'required|min:8',
            password2: 'required|same:password'
        }, {
            required: formatMessage(validationMessages.required),
            min: formatMessage(validationMessages.min),
            max: formatMessage(validationMessages.max),
            'same.password2': formatMessage(validationMessages.passwordNotMatching),
        }, (validator) => {
            validator.setAttributeNames({
                firstName: formatMessage(formMessages.firstName),
                lastName: formatMessage(formMessages.lastName),
                userName: formatMessage(formMessages.userName),
                password: formatMessage(formMessages.password),
                password2: formatMessage(formMessages.passwordVerify)
            });
        });
    }
}

export { UserValidation };
