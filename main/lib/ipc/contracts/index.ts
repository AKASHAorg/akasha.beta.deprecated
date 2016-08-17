/// <reference path="../../../typings/main.d.ts" />
import contracts from '@akashaproject/contracts.js';
import Registry from './Registry';
import Profile from './Profile';

class Contracts {
    public instance: any;

    /**
     * Boostrap web3 contracts
     * @param web3
     */
    init(web3: any) {
        this.instance = new contracts.Class(web3);
        const registry = new Registry(this.instance.objects.registry);
        const profile = new Profile(this.instance.classes.AkashaProfile);
    }
}

export const constructed = new Contracts();




