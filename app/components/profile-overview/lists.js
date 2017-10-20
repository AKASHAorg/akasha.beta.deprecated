import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import { Icon, Input, Tabs } from 'antd';
import { ListCard } from '../';
import { listDelete, listSearch } from '../../local-flux/actions/list-actions';
import { selectLists, selectListSearch } from '../../local-flux/selectors';
import { generalMessages, searchMessages } from '../../locale-data/messages';

const TabPane = Tabs.TabPane;

class Lists extends Component {
    shouldComponentUpdate (nextProps) {
        const { lists, search } = this.props;
        return !lists.equals(nextProps.lists) || search !== nextProps.search;
    }

    onSearchChange = (ev) => {
        this.props.listSearch(ev.target.value);
    };

    render () {
        const { intl, lists, search } = this.props;

        const searchInput = (
          <div className="lists__search">
            <Input
              size="large"
              onChange={this.onSearchChange}
              value={search}
              prefix={<Icon type="search" />}
              placeholder={intl.formatMessage(searchMessages.searchSomething)}
            />
          </div>
        );

        return (
          <div className="lists">
            <div className="lists__content">
              <Tabs tabBarExtraContent={searchInput}>
                <TabPane tab="All" key="all">
                  <div className="lists__masonry-wrap">
                    <Masonry
                      className="lists__masonry"
                      options={{ transitionDuration: 0 }}
                    >
                      {lists.map(list => (
                        <ListCard
                          deleteList={this.props.listDelete}
                          key={list.get('id')}
                          list={list}
                        />
                    ))}
                    </Masonry>
                  </div>
                </TabPane>
                <TabPane tab="Public" key="public">Content of tab 2</TabPane>
                <TabPane tab="Private" key="private">Content of tab 3</TabPane>
              </Tabs>
            </div>
          </div>
        );
    }
}

Lists.propTypes = {
    intl: PropTypes.shape(),
    listDelete: PropTypes.func.isRequired,
    lists: PropTypes.shape(),
    listSearch: PropTypes.func.isRequired,
    search: PropTypes.string
};

function mapStateToProps (state) {
    return {
        lists: selectLists(state),
        search: selectListSearch(state),
    };
}

export default connect(
    mapStateToProps,
    {
        listDelete,
        listSearch
    }
)(injectIntl(Lists));
