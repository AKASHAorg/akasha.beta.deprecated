import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class RegistryStore extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = instance;
    }
}
