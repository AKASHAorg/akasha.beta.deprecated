/// <reference path="../../../typings/main.d.ts" />
import contracts from '@akashaproject/contracts.js';
import Registry from './Registry';
import Profile from './Profile';
import IndexedTags from './IndexedTags';
import Main from './Main';
import Tags from './Tags';

class Contracts {
    public instance: any;

    /**
     * Boostrap web3 contracts
     * @param web3
     * @returns {any}
     */
    init(web3: any) {
        const factory = new contracts.Class(web3);
        const registry = new Registry(factory.objects.registry);
        const profile = new Profile(factory.classes.AkashaProfile);
        const tags = new Tags(factory.objects.tags);
        const indexedTags = new IndexedTags(factory.objects.indexedTags);
        const main = new Main(factory.objects.akashaMain);
        this.instance = { indexedTags, main, profile, registry, tags };
        return this.instance;
    }
}

export const constructed = new Contracts();




