import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Route from 'react-router-dom/Route';
import NewProfileContainer from './new-profile-container';
import NewProfileStatusContainer from './new-profile-status-container';
import NewProfileCompleteContainer from './new-profile-complete-container';
import PanelContainer from '../components/PanelContainer/panel-container';
import PanelHeader from '../components/PanelContainer/panel-container-header';
import PanelFooter from '../components/PanelContainer/panel-container-footer';
import { tempProfileGet, tempProfileCreate, tempProfileDelete } from '../local-flux/actions/temp-profile-actions';

function getRouteConfig(match) {
    return [{
        path: `${match.url}`,
        component: NewProfileCompleteContainer,
        title: () => <div>Create new Identity</div>,
        footer: () => <div>Submit</div>
    }, {
        path: `${match.url}/new-profile-status`,
        component: NewProfileStatusContainer,
        title: () => <div>Creating Identity</div>,
        footer: () => <div>Abort</div>
    }, {
        path: `${match.url}/new-profile-complete`,
        component: NewProfileCompleteContainer,
        title: () => <div>Identity Created</div>,
        footer: () => <div>Enjoy AKASHA</div>
    }]
}

class CreateProfileContainer extends Component {
    render() {
        const { match } = this.props;
        return (
            <PanelContainer>
                <PanelHeader>
                    {getRouteConfig(match).map((route, index) => {
                        return <Route
                            key={index}
                            path={route.path}
                            component={route.title}
                        />
                    })}
                </PanelHeader>
                {getRouteConfig(match).map((route, index) => {
                    return <Route
                        key={index}
                        path={route.path}
                        component={route.component}
                    />
                })}
                <div>
                    <Route path={`${match.url}`} component={NewProfileContainer}/>
                    <Route path={`${match.url}/new-profile-status`} component={NewProfileStatusContainer}/>
                    <Route path={`${match.url}/new-profile-complete`} component={NewProfileCompleteContainer}/>
                </div>
                <PanelFooter>
                    {getRouteConfig(match).map((route, index) => {
                        return <Route
                            key={index}
                            path={route.path}
                            component={route.footer}
                        />
                    })}
                </PanelFooter>
            </PanelContainer>
        );
    }
}

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileGet,
        tempProfileCreate,
        tempProfileDelete
    }
)(CreateProfileContainer);
