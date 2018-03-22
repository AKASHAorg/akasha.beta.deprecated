import debounce from 'lodash.debounce';
import whitelistedActions from './whitelist';
import State from './state';

const shouldBatch = (action) => whitelistedActions.includes(action.type);

export default () => next => (action) => {
    const resolved = next(action);
    if (State.notify && !shouldBatch(action)) {
        State.notify();
    } else {
        debounce(State.notify, 36, { trailing: true });
    }

    return resolved;
}
// optimal wait time ~36-40ms
