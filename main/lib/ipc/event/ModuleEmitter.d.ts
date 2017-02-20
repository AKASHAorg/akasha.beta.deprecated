import { AbstractEmitter } from './AbstractEmitter';
declare abstract class ModuleEmitter extends AbstractEmitter {
    protected MODULE_NAME: string;
    protected DEFAULT_MANAGED: string[];
    protected _manager(): void;
    attachEmitters(): boolean;
    protected _initMethods(methods: any): void;
}
export default ModuleEmitter;
