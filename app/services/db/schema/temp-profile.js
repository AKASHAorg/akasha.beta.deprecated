import MultiResImage from './multi-res-image';

// schema for tempProfile
function Status () {
    return {
        currentStep: Number,
        status: String,
        message: String,
        faucetRequested: false
    };
}

function OptionalData () {
    return {
        avatar: Uint8Array,
        coverImage: [[MultiResImage]],
        about: String,
        links: Array
    };
}

export const TempProfileSchema = {
    firstName: String,
    lastName: String,
    userName: String,
    password: Uint8Array,
    password2: Uint8Array,
    address: String,
    currentStatus: [Status],
    optionalData: [OptionalData]
};
