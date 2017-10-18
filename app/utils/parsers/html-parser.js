const extractInfoFromHtml = (htmlContent, targetTags) => {
    const { metaName, metaProperty, tags } = targetTags;
    const htmlMetaTags = Array.from(htmlContent.getElementsByTagName('meta'));
    // extract meta tag info
    const props = metaProperty.map((property) => {
        const tag = htmlMetaTags.find(fTag =>
            fTag.attributes.length &&
            fTag.attributes.property &&
            fTag.attributes.property.textContent === property
        );
        if (tag) {
            return Promise.resolve({
                [property]: tag.attributes.content.textContent,
            });
        }
        return {};
    });
    return Promise.all(props).then(values =>
        values.reduce((prev, current) =>
            Object.assign({}, prev, current))
    );
};

const htmlParser = (htmlContent, parsedUrl, targetTags) =>
    extractInfoFromHtml(htmlContent, targetTags).then((info) => {
        console.log(info, 'the info');
        return {
            url: parsedUrl.href,
            info: {
                title: info['og:title'],
                description: info['og:description'],
                image: info['og:image']
            }
        };
    });

export default htmlParser;
