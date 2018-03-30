import debounce from 'lodash.debounce';
import State from './state';

const shouldBatch = (action) => action && action.batching;

export default () => next => (action) => {
    const resolved = next(action);
    if (State.notify && !shouldBatch(action)) {
        State.notify();
    } else {
        debounce(State.notify, 48, { leading: true, trailing: true });
    }
    return resolved;
}
