export const redirectCodes = [301, 302, 303, 307, 308];

export const metaTagsPriority = [
    {
        name: 'title',
        key: 'title',
        priority: 1
    }, {
        name: 'application-name',
        key: 'title',
        priority: 3
    }, {
        name: 'og:title',
        key: 'title',
        priority: 2
    }, {
        name: 'description',
        key: 'description',
        priority: 1
    }, {
        name: 'og:description',
        key: 'description',
        priority: 2
    }, {
        name: 'body_description',
        key: 'description',
        priority: 3
    }, {
        name: 'msapplication-TileColor',
        key: 'bgColor',
        priority: 2
    }, {
        name: 'theme-color',
        key: 'bgColor',
        priority: 1
    }, {
        name: 'og:type',
        key: 'type'
    }, {
        name: 'og:image',
        key: 'image',
        priority: 1
    }, {
        name: 'body_image',
        key: 'image',
        priority: 2
    }
]
export const supportedDocs = ['pdf', 'doc', 'txt', 'json', 'md', 'docx', 'odt', 'tex', 'rtf'];
export const supportedProtocols = ['http:', 'https:'];
