import Profile from './Profile';
import Registry from './Registry';
import Tags from './Tags';
import Feed from './Feed';
import Faucet from './Faucet';
import Entries from './Entries';
import Comments from './Comments';
import Votes from './Votes';
import RegistryStore from './RegistryStore';
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
        const registryStore = new RegistryStore(factory.objects.registry_store);
        const profile = new Profile(factory.classes.Profile);
        const tags = new Tags(factory.objects.tags);
        const feed = new Feed(factory.objects.feed);
        const faucet = new Faucet(factory.objects.faucet);
        const entries = new Entries(factory.objects.entries);
        const comments = new Comments(factory.objects.comments);
        const votes = new Votes(factory.objects.votes);
        this.instance = { profile, registry, registryStore, tags, feed, faucet, entries, comments, votes };
        return this.instance;
    }
}

export const constructed = new Contracts();
