import MultiResImage from './multi-res-image';
import ErrorRecord from './error-record';

// schema for tempProfile
function Status () {
    return {
        currentStep: Number,
        status: String,
        error: [ErrorRecord],
        faucetRequested: Boolean,
        publishRequested: Boolean,
        faucetTx: null,
        publishTx: null
    };
}

export const TempProfileSchema = {
    firstName: String,
    lastName: String,
    userName: String,
    password: Uint8Array,
    address: String,
    avatar: Uint8Array,
    coverImage: [[MultiResImage]],
    about: String,
    links: Array,
    currentStatus: [Status]
};
