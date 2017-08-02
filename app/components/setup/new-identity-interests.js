import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Input, Tabs } from 'antd';
import { TagListInterests } from '../../components';
import { SEARCH } from '../../constants/context-types';

class NewIdentityInterests extends Component {
    constructor (props) {
        super(props);
        this.state = { queryInput: props.query };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    getMoreTags = () => {
        const { query, entriesCount } = this.props;
        this.props.tagSearchMore(query, entriesCount.size);
    };

    handleTabChange = (key) => {
        console.log(key);
    };

    handleInputChange = (event) => {
        this.setState({ queryInput: event.target.value });
        this.props.tagSearch(this.state.queryInput);
    };


    render () {
        const { entriesCount, resultsCount, fetchingTags, fetchingMoreTags, interests, toggleInterest } = this.props;
        const checkMoreTags = resultsCount > entriesCount.size;
        const TabPane = Tabs.TabPane;

        return (
          <div className="new-identity-interests">
            <div className="new-identity-interests__left">
              <div>
                <div className="new-identity-interests__left-bold-text">What are you interested in?</div>
                <span> We&#8217;ll suggest incredible stuff to read based on your interests.</span>
              </div>
            </div>
            <div className="new-identity-interests__right">
              <Input
                autoFocus
                onChange={this.handleInputChange}
                value={this.state.queryInput}
                size="large"
                placeholder="Search something..."
                prefix={<Icon type="search" />}
              />
              <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                <TabPane tab="Tags" key="1">
                  <TagListInterests
                    style={{ height: '100%', flexFlow: 'row wrap' }}
                    contextId={SEARCH}
                    tags={entriesCount}
                    fetchingTags={fetchingTags}
                    fetchingMoreTags={fetchingMoreTags}
                    fetchMoreTags={this.getMoreTags}
                    moreTags={checkMoreTags}
                    toggleInterest={toggleInterest}
                  />
                </TabPane>
                <TabPane tab="People" key="2">
                </TabPane>
              </Tabs>
            </div>
          </div>
        );
    }
}

NewIdentityInterests.propTypes = {
    entriesCount: PropTypes.shape(),
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    resultsCount: PropTypes.number,
    query: PropTypes.string,
    tagSearch: PropTypes.func,
    tagSearchMore: PropTypes.func,
    toggleInterest: PropTypes.func
};


export default NewIdentityInterests;
