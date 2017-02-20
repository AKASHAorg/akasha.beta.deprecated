/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Comments extends BaseContract {
    constructor(instance: any);
    comment(entryId: string, hash: string, gas?: number, parent?: string): Promise<any>;
    removeComment(entryId: string, commentId: string, gas?: number): Promise<any>;
    getComment(entryId: string, commentId: string): any;
    getCommentsCount(entryId: string): any;
    getFirstComment(entryId: string): any;
    getLastComment(entryId: string): any;
    getNextComment(entryId: string, commentId: string): any;
    getPrevComment(entryId: string, commentId: string): any;
}
