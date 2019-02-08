import { Record, List } from 'immutable';

const RequestState = Record({
    successActions: new List(),
    errorActions: new List(),
    requestedActions: new List(),
});

export default class RequestStateModel extends RequestState {}
