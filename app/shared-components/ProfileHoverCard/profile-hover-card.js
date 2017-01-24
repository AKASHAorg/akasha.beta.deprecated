import React from 'react';
import { Popover } from 'material-ui';
import styles from './profile-hover-card.scss';

const ProfileHoverCard = (props) => {
    const { profile, open, onClick, onTip, onFollow } = props;
    console.log(open, 'hover card open?');
    return (
      <div
        className={`${styles.root} ${open ? styles.popover : ''}`}
      >
          Profile Hover
      </div>
    );
};
ProfileHoverCard.propTypes = {
    profile: React.PropTypes.shape(),
    onClick: React.PropTypes.func,
    onTip: React.PropTypes.func,
    onFollow: React.PropTypes.func,
    open: React.PropTypes.bool
};

export default ProfileHoverCard;
