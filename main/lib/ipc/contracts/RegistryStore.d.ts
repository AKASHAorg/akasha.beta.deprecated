import BaseContract from './BaseContract';
export default class RegistryStore extends BaseContract {
    constructor(instance: any);
    canStore(id: string, owner: string): void;
    hasStore(id: string, owner: string): void;
}
