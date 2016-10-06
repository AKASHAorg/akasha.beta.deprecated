import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Tags extends BaseContract {

    constructor(instance: any) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.exists.callAsync = Promise.promisify(this.contract.exists.call);
        this.contract.getTagAt.callAsync = Promise.promisify(this.contract.getTagAt.call);
        this.contract.getTagId.callAsync = Promise.promisify(this.contract.getTagId.call);
        this.contract._length.callAsync = Promise.promisify(this.contract._length.call);
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
     * @param id
     * @returns {Bluebird<T>|any}
     */
    public getTagAt(id: number) {
        return this.contract
            .getTagAt
            .callAsync(id);
    }

    public getTagsCount() {
        return this.contract._length.callAsync();
    }

    /**
     *
     * @param tagName
     */
    public getTagId(tagName: string) {
        const tagTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.contract.getTagId.callAsync(tagTr);
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
                return this.extractData('add', tagTr, { gas });
            });
    }

    /**
     *
     * @param filter
     * @returns {Bluebird<T>|any}
     */
    public getCreateError(filter: {fromBlock: string, toBlock: string, address: string}) {
        const Error = this.contract.Error(filter);
        Error.getAsync = Promise.promisify(Error.get);
        return Error.getAsync();
    }

    /**
     *
     * @param filter
     * @returns {Bluebird<T>|any}
     */
    public getTagsCreated(filter: {index: {}, fromBlock: string, toBlock?: string, address?: string}) {
        const { fromBlock, toBlock, address } = filter;
        const TagsCreated = this.contract.TagCreated(filter.index, { fromBlock, toBlock, address });
        TagsCreated.getAsync = Promise.promisify(TagsCreated.get);
        return TagsCreated.getAsync();
    }

}
