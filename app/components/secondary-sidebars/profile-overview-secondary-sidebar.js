import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Menu } from 'antd';
import { profileMessages } from '../../locale-data/messages';

const Item = Menu.Item;

class ProfileOverviewSecondarySidebar extends Component {
    handleClick = (e) => {
        const { history } = this.props;
        const title = e.key;
        console.log('click ', title);
        history.push(`/profileoverview/${title}`);
    }

    render () {
        const { intl, match } = this.props;
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[match.params.title]}
            mode="inline"
          >
            <Item key="overview">{intl.formatMessage(profileMessages.overview)}</Item>
            <Item key="mybalance">{intl.formatMessage(profileMessages.myBalance)}</Item>
            <Item key="rewardsandgoals">{intl.formatMessage(profileMessages.rewardsAndGoals)}</Item>
            <Item key="contacts">{intl.formatMessage(profileMessages.contacts)}</Item>
            <Item key="entries">{intl.formatMessage(profileMessages.entries)}</Item>
            <Item key="highlights">{intl.formatMessage(profileMessages.highlights)}</Item>
            <Item key="lists">{intl.formatMessage(profileMessages.lists)}</Item>
          </Menu>
        );
    }
}


ProfileOverviewSecondarySidebar.propTypes = {
    intl: PropTypes.shape(),
    history: PropTypes.shape(),
    match: PropTypes.shape()
};

export default injectIntl(ProfileOverviewSecondarySidebar);
