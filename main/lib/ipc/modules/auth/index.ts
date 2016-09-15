import Auth from './Auth';

class User {
    public auth: Auth;

    public init() {
        this.auth = new Auth();
    }
}

export const module = new User();
