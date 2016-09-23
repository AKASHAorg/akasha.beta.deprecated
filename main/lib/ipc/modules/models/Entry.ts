import { IpfsConnector } from '@akashaproject/ipfs-connector';

class Entry implements MediaComponent {
    hash: string;
    id: string;

    create(content, tags){
        const constructed = {
            content,
            tags
        };
        return IpfsConnector.getInstance().api
            .add(constructed)
            .then((hash) => {
                this.load(hash);
                return this.hash;
            })
    }

    load(hash: string) {
        this.hash = hash;
    }

    read() {
        if(!this.hash){
            return Promise.reject('Must set hash property first');
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((content) => content);
    }

    update(setData: any) {
        if(!this.hash){
            return Promise.reject('Must set hash property first');
        }
        return IpfsConnector.getInstance().api
            .updateObject(this.hash, setData)
            .then((hash) => {
                this.load(hash);
                return this.hash;
            })
    }

}
