import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Tags extends BaseContract {

    constructor(instance: any) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.exists.callAsync = Promise.promisify(this.contract.exists.call);
        this.contract.getTagName.callAsync = Promise.promisify(this.contract.getTagName.call);
        this.contract.getTagId.callAsync = Promise.promisify(this.contract.getTagId.call);
        this.contract.getTagCount.callAsync = Promise.promisify(this.contract.getTagCount.call);
        this.contract.getFirstTag.callAsync = Promise.promisify(this.contract.getFirstTag.call);
        this.contract.getLastTag.callAsync = Promise.promisify(this.contract.getLastTag.call);
        this.contract.nextTag.callAsync = Promise.promisify(this.contract.nextTag.call);
        this.contract.prevTag.callAsync = Promise.promisify(this.contract.prevTag.call);
        this.contract.check_format.callAsync = Promise.promisify(this.contract.check_format.call);
    }

    /**
     *
     * @param tag
     * @returns {Bluebird<boolean>|any}
     */
    public exists(tag: string) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .exists
            .callAsync(tagTr);
    }


    /**
     *
     * @returns {any}
     */
    public getTagsCount() {
        return this.contract
            .getTagCount
            .callAsync()
            .then((nr) => nr.toNumber());
    }

    /**
     *
     * @param tagName
     */
    public getTagId(tagName: string) {
        const tagTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.contract.getTagId.callAsync(tagTr).then((nr) => nr.toNumber());
    }


    /**
     *
     * @param tagId
     * @returns {any}
     */
    public getTagName(tagId: any) {
        return this.contract
            .getTagName
            .callAsync(tagId)
            .then((name) => this.gethInstance.web3.toUtf8(name));
    }

    /**
     *
     * @param tagName
     * @returns {any}
     */
    public checkFormat(tagName: string) {
        const tagTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.contract
            .check_format
            .callAsync(tagTr)
    }

    /**
     *
     * @param tag
     * @param gas
     * @returns {Bluebird<U>}
     */
    public add(tag: string, gas?: number) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .exists
            .callAsync(tagTr)
            .then((found: boolean) => {
                if (found) {
                    throw new Error('Tag already exists');
                }
                return this.contract
                    .check_format
                    .callAsync(tagTr);
            })
            .then((hasFormat) => {
                if(!hasFormat){
                    throw new Error('Provided Tag has illegal characters');
                }
                return this.extractData('add', tagTr, { gas });
            });
    }

    /**
     *
     * @param filter
     * @returns {Bluebird<T>|any}
     */
    public getTagsCreated(filter: {index: {}, fromBlock: string, toBlock?: string, address?: string}) {
        const { fromBlock, toBlock, address } = filter;
        const TagsCreated = this.contract.Create(filter.index, { fromBlock, toBlock, address });
        TagsCreated.getAsync = Promise.promisify(TagsCreated.get);
        return TagsCreated.getAsync();
    }

}
