import prodStore from './configureStore.production';
import devStore from './configureStore.development';
let ConfigureStore;
if (process.env.NODE_ENV === 'production') {
    ConfigureStore = prodStore;
} else {
    ConfigureStore = devStore;
}

export default ConfigureStore;
