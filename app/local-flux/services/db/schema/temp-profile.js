import MultiResImage from './multi-res-image';

const TempProfileStatusSchema = {
    currentAction: String,
    faucetRequested: Boolean,
    publishRequested: Boolean,
    faucetTx: null,
    publishTx: null
}

const TempProfileSchema = {
    firstName: String,
    lastName: String,
    akashaId: String,
    password: Uint8Array,
    address: String,
    avatar: Uint8Array,
    backgroundImage: [[MultiResImage]],
    about: String,
    links: Array,
    status: [TempProfileStatusSchema]
};
export default TempProfileSchema;
