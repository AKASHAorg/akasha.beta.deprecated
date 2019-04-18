import { createHashHistory } from 'history';

const history = createHashHistory();
export default function getHistory () {
    return history;
}