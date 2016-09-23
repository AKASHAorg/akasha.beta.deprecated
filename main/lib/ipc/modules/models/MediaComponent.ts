interface MediaComponent {
    // ipfs hash
    hash: string;
    // key value from contract
    id: string;

    create(content: any): Promise<string>;

    read(): Promise<any>;

    update(): Promise<string>;

    getShortContent(): Promise<any>;

    getFullContent(): Promise<any>;
}
