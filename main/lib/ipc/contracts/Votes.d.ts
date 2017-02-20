/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Votes extends BaseContract {
    constructor(instance: any);
    upvote(entryId: string, weight: number, value: string, gas?: number): Promise<any>;
    downvote(entryId: string, weight: number, value: string, gas?: number): Promise<any>;
    getVoteCost(weight: number): any;
    getVotesCount(entryId: string): any;
    getFirstVoteId(entryId: string): any;
    getLastVoteId(entryId: string): any;
    getNextVoteId(entryId: string, voteId: string): any;
    getPrevVoteId(entryId: string, voteId: string): any;
    getVoteOf(entryId: string, voteId: string): any;
    getVoteOfProfile(entryId: string, akashaId: string): any;
    getScore(entryId: string): any;
}
