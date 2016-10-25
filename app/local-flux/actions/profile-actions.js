import { ProfileService, AuthService, RegistryService } from '../services';
import { profileActionCreators } from './action-creators';
import imageCreator from '../../utils/imageUtils';

let profileActions = null;

class ProfileActions {
    constructor (dispatch) {
        if (!profileActions) {
            profileActions = this;
        }
        this.profileService = new ProfileService();
        this.authService = new AuthService();
        this.registryService = new RegistryService();
        this.dispatch = dispatch;
        return profileActions;
    }

    login = ({ account, password, rememberTime }) => {
        password = new TextEncoder('utf-8').encode(password);
        this.dispatch(profileActionCreators.login());
        this.authService.login({
            account,
            password,
            rememberTime,
            onSuccess: (data) => {
                this.dispatch(profileActionCreators.loginSuccess(data));
                this.getCurrentProfile();
            },
            onError: error => this.dispatch(profileActionCreators.loginError(error))
        });
    };

    logout = (profileKey, flush) => {
        this.authService.logout({
            options: {
                profileKey,
                flush
            },
            onSuccess: data => this.dispatch(profileActionCreators.logoutSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.logoutError(error))
        });
    };

    getLoggedProfile = () => {
        this.dispatch(profileActionCreators.getLoggedProfile());
        this.authService.getLoggedProfile({
            onSuccess: (data) => {
                this.dispatch(profileActionCreators.getLoggedProfileSuccess(data));
                this.getCurrentProfile();
            },
            onError: error => this.dispatch(profileActionCreators.getLoggedProfileError(error))
        });
    }

    getLocalProfiles = () =>
        this.authService.getLocalIdentities({
            onSuccess: (data) => {
                this.dispatch(profileActionCreators.getLocalProfilesSuccess(data));
            },
            onError: err => this.dispatch(profileActionCreators.getLocalProfilesError(err))
        });

    getCurrentProfile = () =>
        this.registryService.getCurrentProfile({
            onSuccess: data => this.dispatch(profileActionCreators.getCurrentProfileSuccess(data)),
            onError: err => this.dispatch(profileActionCreators.getCurrentProfileError(err))
        })
    /**
     * profiles = [{key: string, profile: string}]
     */
    getProfileData = (profiles) => {
        profiles.forEach((profileObject) => {
            this.profileService.getProfileData({
                options: {
                    profile: profileObject.profile,
                    full: false
                },
                onSuccess: (data) => {
                    if (data.avatar) {
                        data.avatar = imageCreator(data.avatar, data.baseUrl);
                    }
                    this.dispatch(profileActionCreators.getProfileDataSuccess(data));
                },
                onError: (err) => {
                    this.dispatch(profileActionCreators.getProfileDataError(err));
                }
            });
        });
    };

    getProfileBalance = (profileKey, unit) =>
        this.profileService.getProfileBalance({
            options: {
                profile: profileKey,
                unit
            },
            onSuccess: data => this.dispatch(profileActionCreators.getProfileBalanceSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.getProfileBalanceError(error))
        });

    clearLoggedProfile = () => {
        this.authService.deleteLoggedProfile({
            onSuccess: () => this.dispatch(profileActionCreators.deleteLoggedProfileSuccess()),
            onError: error => this.dispatch(profileActionCreators.deleteLoggedProfileError(error))
        });
    };

    clearErrors = () => {
        this.dispatch(profileActionCreators.clearErrors());
    };
    // this method is only called to check if there is a logged profile
    // it does not dispatch anything and is useless as an action
    //
    checkLoggedProfile = (cb) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            if (loggedProfile.get('account')) {
                return cb(null, true);
            }
            return this.authService.getLoggedProfile({
                onSuccess: (data) => {
                    if (data && data.account !== '') {
                        return cb(null, true);
                    }
                    return cb(null, false);
                },
                onError: err => cb(err, false)
            });
        });
    }
}
export { ProfileActions };
