import { apply, call, cancel, cancelled, fork, put, select, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { createEventChannel, enableChannel } from './helpers';

const Channel = window.Channel;

function* logger () {
    while (true) {
        const action = yield take('*');
        console.log('action', action);
    }
}

function* entryIteratorListener () {
    console.log('entry iterator listener');
    const entryIteratorChannel = yield call(createEventChannel, Channel.client.entry.entryTagIterator);

    while (true) {
        const data = yield take(entryIteratorChannel);
        console.log(data);
        yield put({ type: 'ENTRY_TAG_ITERATOR_SUCCESS', data, flags: { fetchingTagEntries: false } });
    }
}

function* watchEntryIterator () {
    while (true) {
        const action = yield take('ENTRY_TAG_ITERATOR');
        console.log('entry tag iterator action', action);
        const { tagName, start, limit } = action;
        Channel.server.entry.entryTagIterator.send({ tagName, start, limit });
    }
}

function filterGethLogs (data, timestamp) {
    const logs = [...data.gethError, ...data.gethInfo]
        .filter(log => new Date(log.timestamp).getTime() > timestamp);
    return logs;
}

function* watchGethLogs () {
    const gethLogs = yield call(createEventChannel, Channel.client.geth.logs);

    try {
        while (true) {
            const data = yield take(gethLogs);
            const timestamp = yield select(state => state.appState.get('timestamp'));
            const logs = filterGethLogs(data, timestamp);
            yield put({ type: 'GET_GETH_LOGS_SUCCESS', data: logs });
        }
    } finally {
        if (yield cancelled()) {
            gethLogs.close();
        }
    }
}

function* startGethLogger () {
    const channel = Channel.server.geth.logs;
    yield call(enableChannel, channel, Channel.client.geth.manager);
    const task = yield fork(watchGethLogs);
    try {
        while (true) {
            yield apply(channel, channel.send, [{}]);
            yield call(delay, 2000);
        }
    } finally {
        if (yield cancelled()) {
            yield cancel(task);
        }
    }
}

function* toggleGethLogger () {
    while (true) {
        yield take('START_GETH_LOGGER');
        const task = yield fork(startGethLogger);
        yield take('STOP_GETH_LOGGER');
        yield cancel(task);
    }
}

export default function* rootSaga () {
    // yield fork(logger);
    // yield fork(entryIteratorListener);
    // yield fork(watchEntryIterator);
    yield fork(toggleGethLogger);
}
