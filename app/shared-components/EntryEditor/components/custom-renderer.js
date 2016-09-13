// import QuoteCaptionComponent from './blocks/blockquotecaption';
// import CaptionComponent from './blocks/caption';
// import AtomicBlock from './blocks/atomic';
import MediaComponent from './blocks/media-component';

export default (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
    // case 'block-quote-caption': return {
    //     component: QuoteCaptionComponent
    // };
    // case 'caption': return {
    //     component: CaptionComponent
    // };
    case 'atomic':
        return {
            component: MediaComponent,
            editable: false
        };
    default: return null;
    }
};
