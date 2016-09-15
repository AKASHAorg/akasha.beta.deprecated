import IndexedTags from './IndexedTags';
import Main from './Main';
import Profile from './Profile';
import Registry from './Registry';
import Tags from './Tags';
import contracts from '@akashaproject/contracts.js';

class Contracts {
    public instance: any;

    /**
     * Boostrap web3 contracts
     * @param web3
     * @returns {any}
     */
    public init(web3: any) {
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
