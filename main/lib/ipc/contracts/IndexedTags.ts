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
    public isSubscribed(subscriber: string, tagId: number) {
        const tagIdTr = this.gethInstance.web3.fromDecimal(tagId);
        return this.contract
            .isSubscribed
            .callAsync(subscriber, tagIdTr);
    }

    /**
     * Get subPosition for unsubscribe
     * @param subscriber
     * @param tagId
     * @returns {any}
     */
    public getSubPosition(subscriber: string, tagId: number) {
        const tagIdTr = this.gethInstance.web3.fromDecimal(tagId);
        return this.contract
            .getSubPosition
            .callAsync(subscriber, tagIdTr);
    }
    /**
     * Subscribe to a tag
     * @param tag
     * @param gas
     * @returns {any}
     */
    public subscribe(tag: string, gas?: number) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .subscribeAsync(tagTr, {gas});
    }

    /**
     * Unsubscribe from a tag
     * @param tag
     * @param subPosition
     * @param gas
     * @returns {any}
     */
    public unsubscribe(tag: string, subPosition: number, gas?: number) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        const subPositionTr = this.gethInstance.web3.fromDecimal(subPosition);
        return this.contract
            .unsubscribeAsync(tagTr, subPositionTr, {gas});
    }
}
