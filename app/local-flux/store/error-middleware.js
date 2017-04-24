const crashReporter = store => next => (action) => {
    try {
        return next(action);
    } catch (err) {
        console.error('Exception caught!', err);
        throw err;
    }
};
const errorHandler = store => next => (action) => {
    console.log(action);
    if (action.contains('_ERROR')) {
        console.log('some error occured');
    }
};

export default { crashReporter, errorHandler };
