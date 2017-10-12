const getVideoId = (search) => {
    const urlParams = new URLSearchParams(search);
    return urlParams.get('v');
};

const youtubeParser = (htmlContent, parsedUrl, targetTags) => {
    // image is at img.youtube.com/vi/<video id>/maxresdefault.jpg;
    const videoId = getVideoId(parsedUrl.search);
    const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const description = htmlContent.getElementsByTagName('div');
    console.log(imageUrl, description, htmlContent, 'youtube data');
};

export default youtubeParser;
