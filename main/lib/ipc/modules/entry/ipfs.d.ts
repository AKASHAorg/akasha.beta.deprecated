/// <reference types="bluebird" />
import * as Promise from 'bluebird';
export declare const DRAFT_BLOCKS = "blocks";
export declare const ATOMIC_TYPE = "atomic";
export declare const IMAGE_TYPE = "image";
export declare const max_size: number;
export declare const EXCERPT = "excerpt";
export declare const FEATURED_IMAGE = "featuredImage";
export declare const DRAFT_PART = "draft-part";
export declare const PREVIOUS_VERSION = "previous-version";
declare class IpfsEntry {
    id: string;
    draft: any;
    title: string;
    licence: string;
    tags: any[];
    wordCount: number;
    entryLinks: any[];
    create(content: any, tags: any[], previous?: {
        hash: string;
        version: number;
    }): Promise<any>;
    edit(content: any, tags: any[], previousHash: any): any;
    private _filterForImages();
    private _uploadMediaDraft();
}
export declare const getShortContent: Function;
export declare const getFullContent: Function;
export default IpfsEntry;
