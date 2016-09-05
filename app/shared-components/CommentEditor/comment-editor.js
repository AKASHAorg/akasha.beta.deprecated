import React from 'react';
import styles from './comment-editor.scss';

class CommentEditor extends React.Component {
    render () {
        return (
          <div className={`${styles.root} row`}>Write a comment</div>
        );
    }
}
CommentEditor.propTypes = {};
export default CommentEditor;
