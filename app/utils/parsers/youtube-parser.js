import ParserUtils from './parser-utils';

class YoutubeParser extends ParserUtils {
    constructor ({ htmlString, parsedUrl }) {
        super();
        this.htmlString = htmlString;
        this.parsedUrl = parsedUrl;
    }

    static match = parsedUrl =>
        parsedUrl.hostname.includes('youtube.com') ||
            parsedUrl.hostname.includes('youtu.be');

    getInfo = () => {
        const videoId = this.getUrlQueryParams(this.parsedUrl.search).get('v');
        const noEmbedUrl = `http://noembed.com/embed?url=http%3A//www.youtube.com/watch%3Fv%3D${videoId}`;
        const hiresImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        return this.makeRequest(hiresImage, 'image/jpeg').then((imgResponse) => {
            const hasHighResImage = (imgResponse.status === 200) && imgResponse.ok;
            return this.makeRequest(noEmbedUrl)
                .then(resp => resp.json())
                .then(jsonItem => ({
                    title: jsonItem.title,
                    image: hasHighResImage ? hiresImage : jsonItem.thumbnail_url,
                    description: `by ${jsonItem.author_name}`
                }));
        });
    }
}
export default YoutubeParser;
