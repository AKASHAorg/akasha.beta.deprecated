import Auth from './Auth';

class User {
    public auth: Auth;

    init() {
        this.auth = new Auth();
    }
}

export const module = new User();
