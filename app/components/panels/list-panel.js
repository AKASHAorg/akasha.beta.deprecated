import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';
import { ListCard } from '../';
import { listDelete } from '../../local-flux/actions/list-actions';
import { selectLists } from '../../local-flux/selectors';

const ListPanel = props => (
  <div style={{ padding: '50px 50px 20px' }}>
    <Masonry
      className="list-panel__masonry"
    >
      {props.lists.toList().map(list => (
        <ListCard
          deleteList={props.listDelete}
          key={list.get('id')}
          list={list}
        />
      ))}
    </Masonry>
  </div>
);

ListPanel.propTypes = {
    listDelete: PropTypes.func.isRequired,
    lists: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        lists: selectLists(state)
    };
}

export default connect(
    mapStateToProps,
    {
        listDelete
    }
)(ListPanel);
