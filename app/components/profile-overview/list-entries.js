import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedDate, injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { entryListIterator, entryMoreListIterator } from '../../local-flux/actions/entry-actions';
import { listDelete } from '../../local-flux/actions/list-actions';
import { entrySelectors, listSelectors } from '../../local-flux/selectors';
import { generalMessages, listMessages } from '../../locale-data/messages';
import { EditListBtn, EntryList, Icon } from '../';

class ListEntries extends Component {
    state = {
        deleteModalVisible: false
    }

    componentDidMount () {
        const { list } = this.props;
        this.props.entryListIterator({ value: list.get('id') });
    }

    deleteList = () => {
        this.setState({
            deleteModalVisible: true
        });
    };

    showDeleteModal = () => {
        const { intl, list, history } = this.props;
        const onOk = () => {
            history.push('/profileoverview/lists');
            this.props.listDelete(list.get('id'));
        };
        const content = intl.formatMessage(listMessages.deleteList);
        return (
          <Modal
            visible={this.state.deleteModalVisible}
            className={'delete-modal'}
            width={320}
            okText={intl.formatMessage(generalMessages.delete)}
            okType={'danger'}
            cancelText={intl.formatMessage(generalMessages.cancel)}
            onOk={onOk}
            onCancel={() => { this.setState({ deleteModalVisible: false }); }}
            closable={false}
          >
            {content}
          </Modal>
        );
    }

    fetchMoreEntries = () => {
        const { list } = this.props;
        this.props.entryMoreListIterator({ columnId: list.get('name'), value: list.get('id') });
    };

    render () {
        const { entries, intl, list } = this.props;

        const date = (
          <div>
            <span>
              {intl.formatMessage(generalMessages.created)}
            </span>
            <FormattedDate
              day="2-digit"
              month="long"
              value={new Date(list.get('timestamp'))}
              year="numeric"
            />
          </div>
        );

        const description = list.get('description') || date;

        return (
          <div className="list-entries">
            {this.showDeleteModal()}
            <div className="list-entries__pad">
              <div className="list-entries__wrap">
                <div className="list-entries__header">
                  <div className="list-entries__subheader">
                    <div className="list-entries__name">
                      {list.get('name')}
                    </div>
                    <div className="list-entries__actions">
                      <EditListBtn
                        list={list}
                      />
                      <Icon
                        className="content-link list-card__icon list-card__icon_delete"
                        onClick={this.deleteList}
                        type="trash"
                      />
                    </div>
                  </div>
                  <div className="list-entries__date">
                    {description}
                  </div>
                </div>
                <div className="list-entries__content">
                  <EntryList
                    contextId={list.get('name')}
                    entries={entries}
                    fetchMoreEntries={this.fetchMoreEntries}
                    masonry
                    moreEntries={list.get('moreEntries')}
                    style={{ padding: '0px 50px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
}

ListEntries.propTypes = {
    entries: PropTypes.shape(),
    entryListIterator: PropTypes.func.isRequired,
    entryMoreListIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape(),
    list: PropTypes.shape(),
    listDelete: PropTypes.func.isRequired
};

function mapStateToProps (state, ownProps) {
    const { listId } = ownProps.match.params;
    const list = listSelectors.selectListById(state, listId);
    const entries = list && list.get('entryIds').map(ele => entrySelectors.selectEntryById(state, ele.entryId));
    return {
        entries,
        list,
    };
}

export default connect(
    mapStateToProps,
    {
        entryListIterator,
        entryMoreListIterator,
        listDelete
    }
)(injectIntl(ListEntries));
