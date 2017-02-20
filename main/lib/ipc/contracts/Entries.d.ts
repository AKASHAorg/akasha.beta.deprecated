/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Entries extends BaseContract {
    constructor(instance: any);
    publish(hash: string, tags: string[], gas?: number): Promise<any>;
    updateEntryContent(hash: string, entryId: string | number, gas?: number): Promise<any>;
    claimDeposit(entryId: string | number, gas?: number): Promise<any>;
    getProfileEntriesCount(akashaId: string): any;
    getProfileEntryFirst(akashaId: string): any;
    getProfileEntryLast(akashaId: string): any;
    getProfileEntryNext(akashaId: string, entryId: string): any;
    getProfileEntryPrev(akashaId: string, entryId: string): any;
    getTagEntriesCount(tagName: string): any;
    getTagEntryFirst(tagName: string): any;
    getTagEntryLast(tagName: string): any;
    getTagEntryNext(tagName: string, entryId: string): any;
    getTagEntryPrev(tagName: string, entryId: string): any;
    isMutable(entryId: string): any;
    getEntry(entryId: string): any;
    getEntryFund(entryId: string): any;
    entryExists(entryId: string): any;
    getPublished(filter: {
        fromBlock: string;
        toBlock?: string;
    }): any;
}
