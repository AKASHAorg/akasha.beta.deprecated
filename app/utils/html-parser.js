const extractInfoFromHtml = (htmlContent, targetTags) => {
    const { metaName, metaProperty, tags } = targetTags;
    const htmlMetaTags = Array.from(htmlContent.getElementsByTagName('meta'));
    const websiteInfo = {};
    // extract meta tag info
    metaProperty.forEach((property) => {
        const tag = htmlMetaTags.find(fTag =>
            fTag.attributes.length &&
            fTag.attributes.property &&
            fTag.attributes.property.textContent === property
        );
        if (tag) {
            websiteInfo[property] = tag.attributes.content.textContent;
        }
    });
    console.log(websiteInfo, 'the info');
    return websiteInfo;
};

export const htmlParser = (htmlString, targetTags, url) => {
    const superParser = new DOMParser();
    const htmlContent = superParser.parseFromString(htmlString, 'text/html');
    return Promise.resolve({
        url,
        info: extractInfoFromHtml(htmlContent, targetTags)
    });
};
