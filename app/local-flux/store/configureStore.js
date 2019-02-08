import prodStore from './configureStore.production';
import devStore from './configureStore.development';
let configureStore = devStore;

if (process.env.NODE_ENV === 'production') {
    configureStore = prodStore
}

export default configureStore;
// export default configureStore;

// if (process.env.NODE_ENV === 'production') {
//     module.exports = require('./configureStore.production')(); // eslint-disable-line global-require
// } else {
//     module.exports = require('./configureStore.development')(); // eslint-disable-line global-require
// }
