import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import readOnlyImagePlugin from 'shared-components/EntryEditor/plugins/readOnlyImage/read-only-image-plugin';
import styles from './entry-page-content.scss';

class EntryPageContent extends Component {
    render () {
        const { entry } = this.props;
        const cleanupEntry = entry.getIn(['content']).toJS().draft.slice(5, entry.get('content').toJS().draft.length - 3);
        const entryContent = editorStateFromRaw(JSON.parse(cleanupEntry));
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
                editorState={entryContent}
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
