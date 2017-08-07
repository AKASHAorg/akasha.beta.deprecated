import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';
import { Input } from 'antd';
import { ListCard } from '../';
import { listDelete, listSearch } from '../../local-flux/actions/list-actions';
import { selectLists, selectListSearch } from '../../local-flux/selectors';

const { Search } = Input;

class ListPanel extends Component {
    shouldComponentUpdate (nextProps) {
        const { lists, search } = this.props;
        return !lists.equals(nextProps.lists) || search !== nextProps.search;
    }

    onSearchChange = (ev) => {
        this.props.listSearch(ev.target.value);
    };

    render () {
        const { lists, search } = this.props;

        return (
          <div style={{ padding: '0px 50px 20px' }}>
            <div
              className="flex-center-y"
              style={{ justifyContent: 'flex-end', height: '50px', width: '100%' }}
            >
              <Search onChange={this.onSearchChange} style={{ width: '200px' }} value={search} />
            </div>
            <Masonry
              className="list-panel__masonry"
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
        );
    }
}

ListPanel.propTypes = {
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
)(ListPanel);
