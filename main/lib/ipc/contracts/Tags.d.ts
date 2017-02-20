import BaseContract from './BaseContract';
export default class Tags extends BaseContract {
    constructor(instance: any);
    exists(tag: string): any;
    getTagsCount(): any;
    getTagId(tagName: string): any;
    getTagName(tagId: any): any;
    checkFormat(tagName: string): any;
    getFirstTag(): any;
    getLastTag(): any;
    getNextTag(idTag: any): any;
    getPrevTag(idTag: any): any;
    add(tag: string, gas?: number): any;
    getTagsCreated(filter: {
        index: {};
        fromBlock: string;
        toBlock?: string;
        address?: string;
    }): any;
}
