import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, DraftJS, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { MentionDecorators } from 'shared-components';
import readOnlyImagePlugin from 'shared-components/EntryEditor/plugins/readOnlyImage/read-only-image-plugin';
import styles from './entry-page-content.scss';

const { CompositeDecorator, EditorState } = DraftJS;

class EntryPageContent extends Component {
    componentWillMount () {
        const decorators = new CompositeDecorator([MentionDecorators.nonEditableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.editorState = EditorState.createEmpty(decorators);
    }

    shouldComponentUpdate (nextProps) {
        if (!nextProps.entry.equals(this.props.entry)) {
            return true;
        }
        return false;
    }

    render () {
        const { entry } = this.props;
        const newEditorState = editorStateFromRaw(entry.getIn(['content', 'draft']));
        const editorState = EditorState.push(this.editorState, newEditorState.getCurrentContent());
        return (
          <div className={`${styles.content_inner} row`} >
            <div className="col-xs-12">
              <h1 className={`${styles.entry_title}`}>
                {entry.getIn(['content', 'title'])}
              </h1>
            </div>
            <div className={`${styles.entry_content} col-xs-12`} >
              <MegadraftEditor
                readOnly
                editorState={editorState}
                onChange={() => {}}
                plugins={[readOnlyImagePlugin]}
              />
            </div>
          </div>
        );
    }
}
EntryPageContent.propTypes = {
    entry: React.PropTypes.shape()
};
export default EntryPageContent;
