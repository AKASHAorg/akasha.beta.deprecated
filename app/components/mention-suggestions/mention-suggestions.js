import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DraftJS } from 'megadraft';
// import { ProfileService } from '../../local-flux/services';
import getSearchText from './utils/get-search-text';
import styles from './mention-suggestions.scss';

const { EditorState, Modifier } = DraftJS;

class MentionSuggestions extends Component {
    constructor (props) {
        super(props);
        // this.profileService = new ProfileService();
        this.timeoutRequest = null;
        this.state = {
            focusedIndex: 0,
            suggestions: [],
            suggestionsPosition: {
                top: 0,
                left: 0
            }
        };
    }

    componentDidMount () {
        window.addEventListener('keydown', this.onKeyDown);
    }

    componentWillReceiveProps (nextProps) {
        const { editorState } = nextProps;
        const selection = editorState.getSelection();
        const prevSelection = this.props.editorState.getSelection();
        const mentionTrigger = '@';
        const { word } = getSearchText(editorState, selection);
        const shouldNotUpdateSuggestions =
            selection.getAnchorOffset() === prevSelection.getAnchorOffset() &&
            selection.getHasFocus() && !prevSelection.getHasFocus();

        if (word.startsWith(mentionTrigger) && word.length > 1 && !shouldNotUpdateSuggestions) {
            this.positionSuggestions();
            // this.profileService.searchInKnownAkashaIds({
            //     search: word.slice(1),
            //     onSuccess: this.updateSearchResults
            // });
        } else if (!word.startsWith(mentionTrigger)) {
            this.setState({
                suggestions: []
            });
        }
    }

    componentDidUpdate (prevProps) {
        const selection = this.props.editorState.getSelection();
        const prevSelection = prevProps.editorState.getSelection();
        if (!selection.getHasFocus() && prevSelection.getHasFocus()) {
            this.timeoutRequest = setTimeout(() => this.setState({
                suggestions: []
            }), 100);
        }
    }

    componentWillUnmount () {
        if (this.timeoutRequest) {
            clearTimeout(this.timeoutRequest);
        }
        window.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = (ev) => {
        const { focusedIndex, suggestions } = this.state;
        if (!suggestions.length) {
            return null;
        }
        if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            return this.setState({
                focusedIndex: focusedIndex === suggestions.length - 1 ? 0 : focusedIndex + 1
            });
        } else if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            return this.setState({
                focusedIndex: focusedIndex === 0 ? suggestions.length - 1 : focusedIndex - 1
            });
        } else if (ev.key === 'Tab' || ev.key === 'Enter') {
            ev.preventDefault();
            return this.replaceText(suggestions[focusedIndex]);
        } else if (ev.key === 'Escape') {
            ev.preventDefault();
            return this.setState({
                suggestions: []
            });
        }
        return null;
    };

    onMouseEnter = index =>
        this.setState({
            focusedIndex: index
        });

    getIsOpen = () =>
        this.state.suggestions.length > 0;

    updateSearchResults = (data) => {
        this.setState({
            focusedIndex: 0,
            suggestions: data
        });
    };

    replaceText = (akashaId) => {
        const { editorState } = this.props;
        const currentSelection = editorState.getSelection();
        const { begin, end } = getSearchText(editorState, currentSelection);

        const mentionTextSelection = currentSelection.merge({
            anchorOffset: begin,
            focusOffset: end
        });
        let mentionReplacedContent = Modifier.replaceText(
            editorState.getCurrentContent(),
            mentionTextSelection,
            `@${akashaId}`
        );
        const blockKey = mentionTextSelection.getAnchorKey();
        const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength();
        if (blockSize === end) {
            mentionReplacedContent = Modifier.insertText(
                mentionReplacedContent,
                mentionReplacedContent.getSelectionAfter().set('hasFocus', true),
                ' ',
            );
        } else {
            const selection = mentionReplacedContent.getSelectionAfter();
            const newSelection = selection.merge({
                anchorOffset: selection.anchorOffset + 1,
                focusOffset: selection.focusOffset + 1,
                hasFocus: true
            });
            mentionReplacedContent = Modifier.insertText(
                mentionReplacedContent,
                newSelection,
                '',
            );
        }

        const newEditorState = EditorState.push(
            editorState,
            mentionReplacedContent
        );
        this.setState({
            suggestions: []
        });
        return this.props.onChange(newEditorState);
    }

    positionSuggestions = () => {
        const { parentRef } = this.props;
        const selection = window.getSelection();
        if (selection.isCollapsed && selection.rangeCount > 0 && !this.state.isActive) {
            const selectionNodeRect = selection.focusNode.parentElement.getBoundingClientRect();
            const parentNodeRect = parentRef.getBoundingClientRect();
            this.setState({
                suggestionsPosition: {
                    top: (selectionNodeRect.top - parentNodeRect.top) + 20,
                    left: selectionNodeRect.left - parentNodeRect.left
                }
            });
        }
    }

    render () {
        const { focusedIndex, suggestions, suggestionsPosition } = this.state;
        if (!suggestions.length) {
            return null;
        }
        return (
          <div
            className={`${styles.root}`}
            style={{
                top: suggestionsPosition.top + 14,
                left: suggestionsPosition.left,
            }}
          >
            {suggestions.map((akashaId, index) =>
              <div
                className={`${styles.result} row middle-xs`}
                key={akashaId}
                onClick={(ev) => { ev.stopPropagation(); this.replaceText(akashaId); }}
                onMouseEnter={() => this.onMouseEnter(index)}
                style={{ backgroundColor: index === focusedIndex ? 'rgba(0, 0, 0, 0.08)' : '' }}
              >
                <div className={styles.akashaId}>
                  {`@${akashaId}`}
                </div>
              </div>
            )}
          </div>
        );
    }
}

MentionSuggestions.propTypes = {
    editorState: PropTypes.shape(),
    onChange: PropTypes.func,
    parentRef: PropTypes.shape(),
};

export default MentionSuggestions;
