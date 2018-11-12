import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import { Input } from 'antd';
import { Icon, ListCard, NewListBtn } from '../';
import { listDelete, listSearch } from '../../local-flux/actions/list-actions';
import { selectLists, selectListSearchTerm } from '../../local-flux/selectors';
import { searchMessages } from '../../locale-data/messages';

class Lists extends Component {
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
          <div className="lists__wrapper">
            <div className="lists">
              <div className="lists__content-wrap">
                <div className="lists__header">
                  {searchInput}
                  <NewListBtn />
                </div>
                <div className="lists__content">
                  <Masonry
                    className="lists__masonry"
                    options={{ transitionDuration: 0, fitWidth: true }}
                    style={{ margin: '0 auto' }}
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
              </div>
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
        search: selectListSearchTerm(state),
    };
}

export default connect(
    mapStateToProps,
    {
        listDelete,
        listSearch
    }
)(injectIntl(Lists));
