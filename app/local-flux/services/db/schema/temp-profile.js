import MultiResImage from './multi-res-image';

const TempProfileSchema = {
    firstName: String,
    lastName: String,
    akashaId: String,
    avatar: Uint8Array,
    backgroundImage: [[MultiResImage]],
    about: String,
    links: Array
};
export default TempProfileSchema;
