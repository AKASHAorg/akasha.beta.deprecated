const errors = [{
    timestamp: 1111,
    message: 'should be filtered out'
}, {
    timestamp: 3333,
    message: '1st'
}, {
    timestamp: 5555,
    message: '3rd'
}];

const infos = [{
    timestamp: 1112,
    message: 'should be filtered out'
}, {
    timestamp: 4444,
    message: '2nd'
}, {
    timestamp: 6666,
    message: '4th'
}];

export const gethLogsResponse = {
    data: {
        gethError: errors,
        gethInfo: infos
    }
};

export const ipfsLogsResponse = {
    data: {
        ipfsError: errors,
        ipfsInfo: infos
    }
};

export const logsExpected = [{
    timestamp: 3333,
    message: '1st'
}, {
    timestamp: 4444,
    message: '2nd'
}, {
    timestamp: 5555,
    message: '3rd'
}, {
    timestamp: 6666,
    message: '4th'
}];
