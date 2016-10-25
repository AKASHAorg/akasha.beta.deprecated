import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class IndexedTags extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.isSubscribed.callAsync = Promise.promisify(this.contract.isSubscribed.call);
        this.contract.getSubPosition.callAsync = Promise.promisify(this.contract.getSubPosition.call);
    }

    /**
     * Check if a profile is subscribed to a specific tag
     * @param subscriber
     * @param tagId
     * @returns {any}
     */
    public isSubscribed(subscriber: string, tagId: string | number) {
        return this.contract
            .isSubscribed
            .callAsync(subscriber, tagId);
    }

    /**
     * Get subPosition for unsubscribe
     * @param subscriber
     * @param tagId
     * @returns {any}
     */
    public getSubPosition(subscriber: string, tagId: string | number) {
        return this.contract
            .getSubPosition
            .callAsync(subscriber, tagId)
            .then((positionBN) => positionBN.toString());
    }

    /**
     * Subscribe to a tag
     * @param tag
     * @param gas
     * @returns {any}
     */
    public subscribe(tag: string, gas?: number) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return Promise.resolve(this.extractData('subscribe', tagTr, { gas }));
    }

    /**
     * Unsubscribe from a tag
     * @param tag
     * @param subPosition
     * @param gas
     * @returns {any}
     */
    public unsubscribe(tag: string, subPosition: string | number, gas?: number) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return Promise.resolve(this.extractData('unsubscribe', tagTr, subPosition, { gas }));
    }

    /**
     *
     * @param filter
     * @returns {Bluebird<T>|any}
     */
    public getIndexedTag(filter: {index?: {tag?: string, tagId?: number | string}, fromBlock: string, toBlock?: string, address?: string}) {
        const {fromBlock, toBlock, address} = filter;
        const IndexedTag = this.contract.IndexedTag(filter.index, {fromBlock, toBlock, address});
        IndexedTag.getAsync = Promise.promisify(IndexedTag.get);
        return IndexedTag.getAsync();
    }

    /**
     *
     * @param filter
     * @returns {Bluebird<T>|any}
     */
    public getIndexTagError(filter: {fromBlock: string, toBlock: string, address: string}) {
    const Error = this.contract.Error(filter);
    Error.getAsync = Promise.promisify(Error.get);
    return Error.getAsync();
    }
}
