import profile from './ipfs';

class Profile {
    public helpers: any;

    init() {
        this.helpers = profile();
    }
}

export const module = new Profile();
