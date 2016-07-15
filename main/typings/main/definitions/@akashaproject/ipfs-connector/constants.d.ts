
declare module 'ipfs-connector/constants' {
    export const events: {
        DOWNLOAD_STARTED: string;
        BINARY_CORRUPTED: string;
        SERVICE_STARTING: string;
        SERVICE_STARTED: string;
        SERVICE_STOPPING: string;
        SERVICE_STOPPED: string;
        SERVICE_FAILED: string;
        IPFS_INIT: string;
        ERROR: string;
    };
    export const options: {
        retry: boolean;
        apiAddress: string;
        args: string[];
        executable: string;
        extra: {
            env: any;
            detached: boolean;
        };
    };
}

