import { ipcRenderer } from 'electron';
import * as types from '../constants/ProfileConstants';
import { ProfileService } from '../services';

class ProfileActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.profileService = new ProfileService;
    }
    validateUsername = (username) => {

    }
    updateProfile = (profileData) => {

    }
    updatePassword = (password1, password2) => {

    }
    /**
     * Step 1:: Create a new Ethereum address
     * Step 2:: Set address as defaultAccount
     * Step 3:: Fund the address from faucet
     * Step 4:: Unlock address
     * Step 5:: Create new AKASHA profile
     */
    createProfile = (userData) => {

    }
    getProfilesList = () => {

    }
}

export { ProfileActions };
