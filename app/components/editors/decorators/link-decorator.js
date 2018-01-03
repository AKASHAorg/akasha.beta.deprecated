import React from 'react';
import PropTypes from 'prop-types';

const LinkDecorator = (passedProps) => {
    const { onOutsideNavigation } = passedProps;
    const Link = (props) => {
        const contentState = props.contentState;
        const { url } = contentState.getEntity(props.entityKey).getData();
        return (
          <a
            className="editor__link"
            href={url}
            title={url}
            onClick={(ev) => { onOutsideNavigation(ev, url); }}
          >
            {props.children}
          </a>
        );
    };
    Link.propTypes = {
        contentState: PropTypes.shape(),
        children: PropTypes.node,
        entityKey: PropTypes.string,
    };
    return Link;
};

export default LinkDecorator;
