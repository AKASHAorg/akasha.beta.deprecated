import Applogger from '../lib/ipc/Logger';

export const initLogger = () => {
    return Applogger.getInstance();
};

export const fireEvent = (channel, data, event) => {
    return {channel, data, event };
};
