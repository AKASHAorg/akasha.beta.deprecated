// import MultiResImage from './multi-res-image';
const CardInfo = {
    title: String,
    description: String,
    image: String,
    bgColor: String,
    url: String,
};

const draftJSContent = {
    blocks: Array,
    entityMap: Object
};

const entryContent = {
    title: String,
    draft: draftJSContent,
    tags: Array,
    excerpt: String,
    cardInfo: CardInfo,
    wordCount: Number,
};
export default entryContent;
