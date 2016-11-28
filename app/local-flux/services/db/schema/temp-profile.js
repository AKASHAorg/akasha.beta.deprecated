import MultiResImage from './multi-res-image';

const TempProfileSchema = {
    firstName: String,
    lastName: String,
    akashaId: String,
    password: Uint8Array,
    address: String,
    avatar: Uint8Array,
    coverImage: [[MultiResImage]],
    about: String,
    links: Array,
    currentStatus: [{
        nextAction: String,
        ethAddressRequested: Boolean,
        faucetRequested: Boolean,
        publishRequested: Boolean,
        faucetTx: null,
        publishTx: null,
        listeningPublishTx: Boolean,
        listeningFaucetTx: Boolean
    }]
};
export default TempProfileSchema;
