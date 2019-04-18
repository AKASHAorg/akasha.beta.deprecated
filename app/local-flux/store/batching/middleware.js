import debounce from 'lodash.debounce';
import State from './state';

const shouldBatch = (action) => action && action.batching;

export default () => next => (action) => {
    const resolved = next(action);
    if (!action.type) {
        console.error('Action', action, 'has undefined type');
    }
    if (State.notify && !shouldBatch(action)) {
        State.notify();
    } else {
        debounce(State.notify, 56, { trailing: true });
    }
    return resolved;
}
