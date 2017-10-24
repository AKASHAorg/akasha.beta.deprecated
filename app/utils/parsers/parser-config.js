
export const redirectCodes = [301, 302, 303, 307, 308];

export const targetMetaTags = {
    metaNames: [{
        name: 'application-name',
        key: 'title'
    }, {
        name: 'description',
        key: 'description'
    }, {
        name: 'msapplication-TileColor',
        key: 'bgColor'
    }, {
        name: 'theme-color',
        key: 'bgColor'
    }],
    metaProperties: [{
        name: 'og:title',
        key: 'title'
    }, {
        name: 'og:description',
        key: 'description'
    }, {
        name: 'og:type',
        key: 'type'
    }, {
        name: 'og:url',
        key: 'url'
    }, {
        name: 'og:image',
        key: 'image'
    }]
};
export const targetTags = [{
    name: 'title',
    key: 'title'
}, {
    name: 'h1',
    key: 'title',
}, {
    name: 'h2',
    key: 'title'
}, {
    name: 'p',
    key: 'description'
}, {
    name: 'img',
    key: 'image',
    selector: 'src'
}];
export const targetIds = [{
    name: 'title',
    key: 'title'
}, {
    name: 'description',
    key: 'description'
}];

export const supportedProtocols = ['http:', 'https:'];
