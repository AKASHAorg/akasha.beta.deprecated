// schema for tempProfile
function Status () {
    return {
        currentStep: Number,
        status: String,
        message: String,
        faucetRequested: false
    };
}

function CoverImage () {
    return {
        key: String,
        imageFile: Uint8Array,
        width: Number,
        height: Number
    };
}

function OptionalData () {
    return {
        avatar: Uint8Array,
        coverImage: [[CoverImage]],
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
