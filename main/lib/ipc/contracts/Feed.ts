import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Feed extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = instance;
    }
}
