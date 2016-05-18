import strategy from 'react-validatorjs-strategy';

export const user = {
    schema: strategy.createSchema({
        firstName: 'required|min:3',
        lastName: 'required|min:3',
        userName: 'required|min:4',
        password: 'required|min:8',
        password2: 'required|same:password'
    }, {
        required: 'The :attribute is required.',
        min: ':attribute should be at least :min characters long.',
        max: ':attribute should not have more than :max characters.',
        'same.password2': 'Oups! Password verification is different than first one!'
    })
};
