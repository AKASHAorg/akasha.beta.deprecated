const getVideoId = (search) => {
    const urlParams = new URLSearchParams(search);
    return urlParams.get('v');
};

const makeApiRequest = (videoId) => {
    const reqHeaders = new Headers();
    reqHeaders.append('Content-Type', 'application/json');

    const requestParams = {
        method: 'GET',
        headers: reqHeaders,
        mode: 'cors'
    };

    const req = new Request(
        `http://noembed.com/embed?url=http%3A//www.youtube.com/watch%3Fv%3D${videoId}`,
        requestParams
    );
    return fetch(req);
};

const youtubeParser = (htmlContent, parsedUrl, targetTags) => {
    // image is at img.youtube.com/vi/<video id>/maxresdefault.jpg;
    const videoId = getVideoId(parsedUrl.search);
    return makeApiRequest(videoId).then(resp =>
        // console.log(data.json(), 'data came from youtube')
        resp.json().then(jsonItem => ({
            title: jsonItem.title,
            image: jsonItem.thumbnail_url,
            description: jsonItem.author_name
        })));
};

export default youtubeParser;
