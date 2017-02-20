/// <reference types="bluebird" />
import BaseContract from './BaseContract';
import * as Promise from 'bluebird';
export default class Feed extends BaseContract {
    constructor(instance: any);
    follow(id: string, gas?: number): Promise<any>;
    unFollow(id: string, gas?: number): Promise<any>;
    isFollowing(follower: string, id: string): any;
    isFollower(id: string, following: string): any;
    getFollowingCount(id: string): any;
    getFollowingFirst(id: string): any;
    getFollowingLast(id: string): any;
    getFollowingNext(id: string, fromId: string): any;
    getFollowingPrev(id: string, fromId: string): any;
    getFollowingById(id: string, indexId: string): any;
    getFollowersCount(id: string): any;
    getFollowersFirst(id: string): any;
    getFollowersLast(id: string): any;
    getFollowersNext(id: string, fromId: string): any;
    getFollowersPrev(id: string, fromId: string): any;
    getFollowersById(id: string, indexId: string): any;
}
