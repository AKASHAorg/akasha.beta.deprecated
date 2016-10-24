interface MediaComponent {
    // ipfs hash
    hash: string;
    // key value from contract
    id: string;

    create(content: any, ...others: any[]): any;

    read(): Promise<any>;

    update(newData: any): Promise<string>;

    getShortContent(): Promise<any>;

    getFullContent(): Promise<any>;
}
