import React from 'react';
import Fuse from 'fuse.js';

import dummyData from './dummy-data';

export const HandleComponent = (props) => {
    let text = props.decoratedText;
    let fuse = new Fuse(dummyData, {
        keys: [{
            name: 'username',
            weight: 0.5
        }]
    });
    let results = fuse.search(text).slice(0, 3).map((user, key) => {
        return <li key={key}>{user.first_name} {user.last_name}</li>;
    });
    return (
        <span {...props} style={{ color: 'blue', cursor: 'pointer' }}>
            { props.children }
            { results &&
                <ul>
                    {results}
                </ul>
            }
        </span>
    );
};
HandleComponent.propTypes = {
    decoratedText: React.PropTypes.string,
    children: React.PropTypes.node
};

