import { batchedSubscribe } from 'redux-batched-subscribe'
import State from './state'

export default batchedSubscribe(
    (freshNotify) => {
        State.notify = freshNotify
    }
);
