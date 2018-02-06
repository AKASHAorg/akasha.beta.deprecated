import PropTypes from 'prop-types';
import React from 'react';
import * as columnTypes from '../../constants/columns';
import { LatestColumn, ListColumn, ProfileColumn, ProfileEntriesColumn, ProfileFollowersColumn,
    ProfileFollowingsColumn, StreamColumn, TagColumn } from '../';
import ColumnManager from './column-manager';

const Column = ({ column, baseWidth, ethAddress, type }) => {
    let component;
    const props = { column, baseWidth };
    component = <ColumnManager {...props} />;
    // switch (type) {
    //     case columnTypes.latest:
    //         component = <LatestColumn {...props} />;
    //         break;
    //     case columnTypes.list:
    //         component = <ListColumn {...props} />;
    //         break;
    //     case columnTypes.tag:
    //         component = <TagColumn {...props} />;
    //         break;
    //     case columnTypes.stream:
    //         component = <StreamColumn {...props} />;
    //         break;
    //     case columnTypes.profile:
    //         component = <ProfileColumn {...props} />;
    //         break;
    //     case columnTypes.profileEntries:
    //         component = <ProfileEntriesColumn ethAddress={ethAddress} />;
    //         break;
    //     case columnTypes.profileFollowers:
    //         component = <ProfileFollowersColumn ethAddress={ethAddress} />;
    //         break;
    //     case columnTypes.profileFollowings:
    //         component = <ProfileFollowingsColumn ethAddress={ethAddress} />;
    //         break;
    //     default:
    //         break;
    // }

    return (
      <div className="column__wrapper">
        {component}
      </div>
    );
};

Column.propTypes = {
    baseWidth: PropTypes.number,
    column: PropTypes.shape(),
    ethAddress: PropTypes.string,
    type: PropTypes.string,
};

export default Column;
