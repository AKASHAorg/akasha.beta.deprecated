/// <reference types="node" />
declare var _default: {
    "blocks": ({
        "key": string;
        "text": string;
        "type": string;
        "depth": number;
        "inlineStyleRanges": any[];
        "entityRanges": any[];
        "data": {
            "type": string;
            "media": string;
            "termsAccepted": boolean;
            "licence": string;
            "caption": string;
            "files": {
                "xs": {
                    "width": number;
                    "height": number;
                    "src": Buffer;
                };
                "sm": {
                    "width": number;
                    "height": number;
                    "src": Buffer;
                };
                "md": {
                    "width": number;
                    "height": number;
                    "src": Buffer;
                };
                "lg": {
                    "width": number;
                    "height": number;
                    "src": Buffer;
                };
                "xl": {
                    "width": number;
                    "height": number;
                    "src": Buffer;
                };
            };
        };
    } | {
        "key": string;
        "text": string;
        "type": string;
        "depth": number;
        "inlineStyleRanges": any[];
        "entityRanges": {
            "offset": number;
            "length": number;
            "key": number;
        }[];
        "data": {};
    } | {
        "key": string;
        "text": string;
        "type": string;
        "depth": number;
        "inlineStyleRanges": {
            "offset": number;
            "length": number;
            "style": string;
        }[];
        "entityRanges": any[];
        "data": {};
    })[];
    "entityMap": {
        "0": {
            "type": string;
            "mutability": string;
            "data": {
                "url": string;
            };
        };
    };
};
export default _default;
