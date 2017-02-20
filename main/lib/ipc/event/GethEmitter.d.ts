import { AbstractEmitter } from './AbstractEmitter';
declare abstract class GethEmitter extends AbstractEmitter {
    attachEmitters(): void;
    private _download();
    private _starting();
    private _started();
    private _stopped();
    private _fatal();
    private _error();
    private _upgrading();
}
export default GethEmitter;
