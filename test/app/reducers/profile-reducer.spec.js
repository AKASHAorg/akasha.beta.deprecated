import chai from 'chai';
import chaiIM from 'chai-immutable';
import { List, Map } from 'immutable';
import { ErrorRecord, LoggedProfile, ProfileRecord,
    ProfileState } from '../../../app/local-flux/reducers/records';
import ProfileReducer from '../../../app/local-flux/reducers/profileState';
import * as actions from '../../../app/local-flux/actions/profile-actions';
import * as types from '../../../app/local-flux/constants';

chai.use(chaiIM);
const { expect } = chai;

describe('profile reducer tests:', () => {
    const initialState = new ProfileState();
    let modifiedState;

    beforeEach(() => {
        modifiedState = null;
    });

    describe('Initial state', () => {
        it('should return initialState when action is undefined', () => {
            modifiedState = ProfileReducer(undefined, {});
            expect(modifiedState).to.eql(initialState);
        });
    });
    describe(types.PROFILE_GET_CURRENT, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetCurrent());
            expect(modifiedState.getIn(['flags', 'currentProfilePending'])).to.be.true;
        });
    });
    describe(types.PROFILE_GET_CURRENT_ERROR, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetCurrent());
            modifiedState = ProfileReducer(initialState, actions.profileGetCurrentError({}));
            expect(modifiedState.getIn(['flags', 'currentProfilePending'])).to.be.false;
        });
    });
    describe(types.PROFILE_GET_CURRENT_SUCCESS, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetCurrent());
            modifiedState = ProfileReducer(initialState, actions.profileGetCurrentSuccess({}));
            expect(modifiedState.getIn(['flags', 'currentProfilePending'])).to.be.false;
        });
        it('should set logged profile', () => {
            const akashaId = 'test';
            const profile = '0xblablabla';
            const resp = { akashaId, profileAddress: profile };
            const expected = new LoggedProfile({ akashaId, profile });
            modifiedState = ProfileReducer(
                initialState,
                actions.profileGetCurrentSuccess(resp)
            );
            expect(modifiedState.get('loggedProfile')).to.eql(expected,
                'loggedProfile was not set correctly');
        });
        it('should update logged profile', () => {
            const akashaId = 'test';
            const profile = '0xblablabla';
            const resp = { akashaId, profileAddress: profile };
            const existing = {
                account: '0xexisting',
                expiration: '02/02/1600',
                token: 'efgh'
            };
            const state = initialState.set('loggedProfile', new LoggedProfile(existing));
            modifiedState = ProfileReducer(
                state,
                actions.profileGetCurrentSuccess(resp)
            );
            const expected = new LoggedProfile({ akashaId, profile, ...existing });
            expect(modifiedState.get('loggedProfile')).to.eql(expected,
                'loggedProfile was not updated correctly');
        });
    });
    describe(types.PROFILE_GET_LIST, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetList());
            expect(modifiedState.getIn(['flags', 'fetchingProfileList'])).to.be.true;
        });
    });
    describe(types.PROFILE_GET_LIST_ERROR, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetList());
            modifiedState = ProfileReducer(initialState, actions.profileGetListError({}));
            expect(modifiedState.getIn(['flags', 'fetchingProfileList'])).to.be.false;
        });
    });
    describe(types.PROFILE_GET_LIST_SUCCESS, () => {
        it('should set the correct flag', () => {
            const resp = { collection: [] };
            modifiedState = ProfileReducer(initialState, actions.profileGetList());
            modifiedState = ProfileReducer(initialState, actions.profileGetListSuccess(resp));
            expect(modifiedState.getIn(['flags', 'fetchingProfileList'])).to.be.false;
        });
        it('should add entries in byId map', () => {
            const firstProfile = '0xfirstblablabla';
            const secondProfile = '0xsecondblablabla';
            const resp = {
                collection: [{
                    akashaId: 'first',
                    avatar: 'firstavatar',
                    baseUrl: 'url',
                    profile: firstProfile
                }, {
                    akashaId: 'second',
                    avatar: 'secondavatar',
                    baseUrl: 'url',
                    profile: secondProfile
                }]
            };
            modifiedState = ProfileReducer(
                initialState,
                actions.profileGetListSuccess(resp)
            );
            // when adding a profile in the "byId" map, we also create the complete avatar url
            resp.collection[0].avatar = 'url/firstavatar';
            resp.collection[1].avatar = 'url/secondavatar';
            const expected = new Map({
                [firstProfile]: new ProfileRecord(resp.collection[0]),
                [secondProfile]: new ProfileRecord(resp.collection[1])
            });
            expect(modifiedState.get('byId')).to.eql(expected,
                'byId map was not updated correctly');
        });
        it('should overwrite entries in byId map', () => {
            const profile = '0xblablabla';
            const resp = {
                collection: [{
                    akashaId: 'test',
                    baseUrl: 'url',
                    profile
                }]
            };
            const state = initialState.setIn(['byId', profile], new ProfileRecord({
                akashaId: 'akashaId',
                firstName: 'first name'
            }));
            modifiedState = ProfileReducer(
                state,
                actions.profileGetListSuccess(resp)
            );
            const expected = new Map({
                [profile]: new ProfileRecord(resp.collection[0])
            });
            expect(modifiedState.get('byId')).to.eql(expected,
                'byId map was not updated correctly');
        });
    });
    describe(types.PROFILE_GET_LOCAL, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetLocal());
            expect(modifiedState.getIn(['flags', 'fetchingLocalProfiles'])).to.be.true;
            expect(modifiedState.getIn(['flags', 'localProfilesFetched'])).to.be.false;
        });
    });
    describe(types.PROFILE_GET_LOCAL_ERROR, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetLocal());
            modifiedState = ProfileReducer(initialState, actions.profileGetLocalError({}));
            expect(modifiedState.getIn(['flags', 'fetchingLocalProfiles'])).to.be.false;
            expect(modifiedState.getIn(['flags', 'localProfilesFetched'])).to.be.true;
        });
    });
    describe(types.PROFILE_GET_LOCAL_SUCCESS, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileGetLocal());
            modifiedState = ProfileReducer(initialState, actions.profileGetLocalSuccess([]));
            expect(modifiedState.getIn(['flags', 'fetchingLocalProfiles'])).to.be.false;
            expect(modifiedState.getIn(['flags', 'localProfilesFetched'])).to.be.true;
        });
        it('should update ethAddresses map', () => {
            const key = '0xethkey';
            const profile = '0xethprofile';
            const resp = [{ key, profile }];
            const expected = new Map({ [profile]: key });
            modifiedState = ProfileReducer(
                initialState,
                actions.profileGetLocalSuccess(resp)
            );
            expect(modifiedState.get('ethAddresses')).to.eql(expected,
                'ethAddresses was not updated correctly');
        });
        it('should update localProfiles list', () => {
            const key = '0xethkey';
            const profile = '0xethprofile';
            const resp = [{ key, profile }];
            const expected = new List([profile]);
            modifiedState = ProfileReducer(
                initialState,
                actions.profileGetLocalSuccess(resp)
            );
            expect(modifiedState.get('localProfiles')).to.eql(expected,
                'localProfiles was not updated correctly');
        });
    });
    describe(types.PROFILE_LOGIN, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileLogin());
            expect(modifiedState.getIn(['flags', 'loginPending'])).to.be.true;
        });
    });
    describe(types.PROFILE_LOGIN_ERROR, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileLogin());
            modifiedState = ProfileReducer(initialState, actions.profileLoginError({}));
            expect(modifiedState.getIn(['flags', 'loginPending'])).to.be.false;
        });
        it('should add the error in loginErrors', () => {
            const error = { message: 'login error' };
            modifiedState = ProfileReducer(initialState, actions.profileLoginError(error));
            expect(modifiedState.get('loginErrors').size).to.equal(1,
                'there should be 1 login error');
            expect(modifiedState.get('loginErrors').first()).to.eql(new ErrorRecord(error),
                'there should be 1 login error');
        });
    });
    describe(types.PROFILE_LOGIN_SUCCESS, () => {
        it('should set the correct flag', () => {
            modifiedState = ProfileReducer(initialState, actions.profileLogin());
            modifiedState = ProfileReducer(initialState, actions.profileLoginSuccess({}));
            expect(modifiedState.getIn(['flags', 'loginPending'])).to.be.false;
        });
        it('should set logged profile', () => {
            const resp = { account: '0xaccount', expiration: '01/01/1500', token: 'abcd' };
            const expected = new LoggedProfile(resp);
            modifiedState = ProfileReducer(
                initialState,
                actions.profileLoginSuccess(resp)
            );
            expect(modifiedState.get('loggedProfile')).to.eql(expected,
                'loggedProfile was not set correctly');
        });
        it('should overwrite existing logged profile', () => {
            const resp = { account: '0xaccount', expiration: '01/01/1500', token: 'abcd' };
            const expected = new LoggedProfile(resp);
            const state = initialState.set('loggedProfile', new LoggedProfile({
                account: '0xexisting',
                expiration: '02/02/1600',
                token: 'efgh'
            }));
            modifiedState = ProfileReducer(
                state,
                actions.profileLoginSuccess(resp)
            );
            expect(modifiedState.get('loggedProfile')).to.eql(expected,
                'loggedProfile was not set correctly');
        });
    });
});
