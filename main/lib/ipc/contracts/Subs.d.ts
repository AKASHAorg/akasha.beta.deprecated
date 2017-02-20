/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Subs extends BaseContract {
    constructor(instance: any);
    subscribe(tagName: string, gas?: number): Promise<any>;
    unSubscribe(tagName: string, gas?: number): Promise<any>;
    subsCount(id: string): any;
    subsFirst(id: string): any;
    subsLast(id: string): any;
    subsNext(id: string, tagId: string): any;
    subsPrev(id: string, tagId: string): any;
    isSubscribed(id: string, tagName: string): any;
}
