import profile from './ipfs';

class Profile {
    public helpers: any;

    public init() {
        this.helpers = profile();
    }
}

export const module = new Profile();
