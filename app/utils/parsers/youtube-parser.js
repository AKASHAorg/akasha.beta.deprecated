const getVideoId = (search) => {
    const urlParams = new URLSearchParams(search);
    return urlParams.get('v');
};

const makeApiRequest = (url, contentType = 'application/json') => {
    const reqHeaders = new Headers();
    reqHeaders.append('Content-Type', contentType);

    const requestParams = {
        method: 'GET',
        headers: reqHeaders,
        mode: 'cors'
    };

    const req = new Request(url, requestParams);
    return fetch(req);
};

const youtubeParser = (parsedUrl) => {
    const videoId = getVideoId(parsedUrl.search);
    // image is at img.youtube.com/vi/<video id>/maxresdefault.jpg;
    const noEmbedUrl = `http://noembed.com/embed?url=http%3A//www.youtube.com/watch%3Fv%3D${videoId}`;
    const hiresImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return makeApiRequest(hiresImage, 'image/jpeg').then((imgResponse) => {
        const hasHighResImage = (imgResponse.status === 200) && imgResponse.ok;
        console.log(hasHighResImage, imgResponse);
        return makeApiRequest(noEmbedUrl).then(resp =>
            // console.log(data.json(), 'data came from youtube')
            resp.json().then(jsonItem => ({
                info: {
                    title: jsonItem.title,
                    image: hasHighResImage ? hiresImage : jsonItem.thumbnail_url,
                    description: `by ${jsonItem.author_name}`
                },
                url: parsedUrl.href
            })));
    });
};

export default youtubeParser;
