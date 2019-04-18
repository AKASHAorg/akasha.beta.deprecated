import prodStore from './configureStore.production';
import devStore from './configureStore.development';

let configureStore = devStore;

if (process.env.NODE_ENV === 'production') {
    configureStore = prodStore
}

export default configureStore;
