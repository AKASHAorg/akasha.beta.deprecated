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
        avatarFile: Blob,
        backgroundImage: Array,
        about: String,
        links: Object
    };
}

export const TempProfileSchema = {
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    password2: String,
    address: String,
    currentStatus: [Status],
    optionalData: [OptionalData]
};
