import createHashHistory from "history/createHashHistory";

const history = createHashHistory();
export default function getHistory () {
    return history;
}