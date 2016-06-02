import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PanelActions from '../../../actions/PanelActions';
import {
  MenuAddEntry,
  MenuAkashaLogo,
  MenuCommunities,
  MenuEntries,
  MenuEthereum,
  MenuPeople,
  MenuPortals,
  MenuSearch,
  MenuStreams,
  MenuUser
} from '../svg';
import Profile from './IconProfile';
import AddEntry from './IconAddEntry';
import Search from './IconSearch';
import Streams from './IconStreams';
import Portals from './IconPortals';
import Community from './IconCommunity';
import People from './IconPeople';
import Logo from './IconLogo';

class SideBar extends Component {
    render () {
        let { 
            style,
            iconStyle,
            innerStyle,
            ...other } = this.props;
        return (
            <div style={style} >
                <div style={{flexGrow: 1, padding: '16px'}} >
                    <Profile onClick = {this._handlePanelShow.bind(null, {name: 'userProfile', overlay: true})} />
                </div>
            <div style={{flexGrow: 1, padding: '16px'}} >
                <AddEntry onClick = {this._handleNewEntry} tooltip="Add new entry" />
                <Search onClick = {this._handleSearch} tooltip = "Search" />
            </div>
            <div style={{flexGrow: 4, padding: '16px'}} >
                <Streams onClick = {this._handleNavigation.bind(this, null)} tooltip = "Stream" />
                <Portals disabled tooltip="Coming Soon" />
                <Community disabled tooltip="Coming Soon" />
                <People onClick = {this._handlePeople} tooltip = "People" />
            </div>
            <div style={{flexGrow: 1, padding: '16px'}} >
                <Logo style={{position:'absolute', bottom: '16px', width: '32px', height: '32px'}} />
            </div>
            </div>
        );

    }
    _handleNewEntry = (ev) => {
        const entries = 0;
        if(entries > 0) {
            this.props.dispatch(PanelActions.showPanel({name: 'newEntry', overlay: true}));
        } else {
            this.props.dispatch(PanelActions.hidePanels());
            this.context.router.push('/severs/new-entry');
        }
    }
    _handleNavigation = (to, ev) => {
        const basePath = '/severs'; //change this with logged user`s username

        this.props.dispatch(PanelActions.hidePanels());
        if(!to) {
            // navigate to index route
            return this.context.router.push(basePath);
        }
        this.context.router.push(`${basePath}/${to}`);
    }
    _handlePanelShow = (panelName, ev) => {
        this.props.dispatch(PanelActions.showPanel(panelName));
    }
}
SideBar.propTypes = {
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    innerStyle: PropTypes.object,
    viewBox: PropTypes.string,
    color: PropTypes.string,
};

SideBar.contextTypes = {
    router: React.PropTypes.object,
    actions: React.PropTypes.object
}
SideBar.defaultProps = {
    style: {
        height: '100%',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#f3f3f3',
        borderRight: '1px solid #cccccc',
        width: '64px'
    },
    iconStyle: {
        width: '32px',
        height: '32px'
    },
    viewBox: '0 0 32 32',
    color: '#000'
}
export default connect(
    state => ({ 
        panelState: state.panelState,
        profiles: state.profile
    })
)(SideBar);