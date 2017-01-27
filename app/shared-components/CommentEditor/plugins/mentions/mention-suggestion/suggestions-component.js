import React from 'react';
import { DraftJS } from 'megadraft';

const SuggestionsComponent = ({entityKey, children}) => {
    console.log(entityKey, children);
    const data = DraftJS.Entity.get(this.props.entityKey).getData();
    return (
        <span data-suggestion-for={data} style={{ color: '#478fff', cursor: 'pointer', fontWeight: 500 }}>
          {children}
        </span>
    );
};

SuggestionsComponent.propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.shape())
};

export default SuggestionsComponent;
