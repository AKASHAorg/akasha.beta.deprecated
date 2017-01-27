import handleStrategy from './mention/handle-strategy';
import suggestionsStrategy from './mention-suggestion/suggestions-strategy';
import HandleComponent from './mention/handle-component';
import SuggestionsComponent from './mention-suggestion/suggestions-component';

export const SUGGESTIONS_REGEX = /(^|[^@\w])@(\w{3,32})\b/g;
export const MENTION_HANDLE_REGEX = /@[\w]+/g;

export default function (initialProps) {
    return [
        // {
        //     strategy: handleStrategy,
        //     component: HandleComponent(initialProps)
        // },
        {
            strategy: suggestionsStrategy,
            component: SuggestionsComponent(initialProps)
        }
    ];
}
