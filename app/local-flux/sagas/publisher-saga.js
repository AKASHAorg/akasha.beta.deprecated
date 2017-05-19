import { take, put, takeEvery, select, call } from 'redux-saga';
import * as types from '../constants';

const EXPIRATION_AMOUNT_OFFSET = 3000; // in ms

function* checkLogin () {
    const loggedProfile = yield select(state => state.profileState.get('loggedProfile'));
    return Date.parse(loggedProfile.get('expiration')) + EXPIRATION_AMOUNT_OFFSET > Date.now();    
}

function* publishEntity (action) {
    // - determine the entity type and check if needs confirmation;
    // - save entity in database
    // - publish through main channel
    // - receive tx through main channel
    // - listen for mined tx
    // - delete entity from db when complete
    // - BONUS - get entity id somehow and update in reducer (optimistic publishing!)
}

function* watchEntityPublish () {
    // catch publish actions
    const publishActionRegex = /^(PUBLISH_)/;
    while (true) {
        const publishAction = yield take(action => publishActionRegex.test(action.type));
        let isLoggedIn = yield call(checkLogin);

        if (!isLoggedIn) {
            yield put(types.SHOW_AUTH_DIALOG);
            yield take(types.PROFILE_LOGIN_SUCCESS);
            isLoggedIn = yield call(checkLogin);
        }
        // make sure it`s actually logged in
        if (isLoggedIn) {
            // we can continue publishing
            yield call(publishEntity, publishAction);
        }
    }
}

export default function* watchPublishActions () {
    yield fork(watchEntityPublish);
}
