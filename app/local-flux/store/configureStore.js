let configureStore = import('./configureStore.production');
if (process.env.NODE_ENV !== 'production') {
    configureStore = import('./configureStore.development');
}
export default configureStore;

// if (process.env.NODE_ENV === 'production') {
//     module.exports = require('./configureStore.production')(); // eslint-disable-line global-require
// } else {
//     module.exports = require('./configureStore.development')(); // eslint-disable-line global-require
// }
