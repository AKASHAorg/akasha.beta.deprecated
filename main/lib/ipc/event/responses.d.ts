export declare const gethResponse: (data: Object, error?: {
    message: string;
    fatal?: boolean;
}) => MainResponse;
export declare const ipfsResponse: (data: Object, error?: {
    message: string;
    fatal?: boolean;
    from?: {};
}) => MainResponse;
export declare const mainResponse: (rawData: any) => MainResponse;
