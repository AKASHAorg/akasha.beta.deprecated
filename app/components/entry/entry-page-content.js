import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { MegadraftEditor, editorStateFromRaw, DraftJS, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { IconButton, SvgIcon } from 'material-ui';
import { MentionDecorators, TagChip } from '../../shared-components';
import readOnlyImagePlugin from '../../shared-components/EntryEditor/plugins/readOnlyImage/read-only-image-plugin';
import { AllRightsReserved, CreativeCommonsBY, CreativeCommonsCC, CreativeCommonsNCEU,
    CreativeCommonsNCJP, CreativeCommonsNC, CreativeCommonsND, CreativeCommonsREMIX,
    CreativeCommonsSHARE, CreativeCommonsZERO, CreativeCommonsPD,
    CreativeCommonsSA } from '../svg';
import styles from './entry-page-content.scss';

const { CompositeDecorator, EditorState } = DraftJS;

class EntryPageContent extends Component {
    componentWillMount () {
        const decorators = new CompositeDecorator([MentionDecorators.nonEditableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.editorState = EditorState.createEmpty(decorators);
    }

    shouldComponentUpdate (nextProps) {
        if (!nextProps.entry.equals(this.props.entry)) {
            return true;
        }
        return false;
    }

    navigateToTag = (ev, tagName) => {
        const { history } = this.props;
        history.push(`/tag/${tagName}`);
    };

    renderLicenseIcons = () => {
        const { entry, licenses } = this.props;
        const licence = licenses.get(entry.content.licence.id);

        if (!licence) {
            return null;
        }

        const licenseIcons = {
            'copyright-1': AllRightsReserved,
            CCBY: CreativeCommonsBY,
            CCCC: CreativeCommonsCC,
            CCNCEU: CreativeCommonsNCEU,
            CCNCJP: CreativeCommonsNCJP,
            CCNC: CreativeCommonsNC,
            CCND: CreativeCommonsND,
            CCREMIX: CreativeCommonsREMIX,
            CCSHARE: CreativeCommonsSHARE,
            CCZERO: CreativeCommonsZERO,
            CCPD: CreativeCommonsPD,
            CCSA: CreativeCommonsSA
        };

        return (
          <div style={{ display: 'inline-flex' }}>
            {licence.description.map((descr) => { // eslint-disable-line consistent-return, array-callback-return, max-len
                if (descr.icon && licenseIcons[descr.icon] !== undefined) {
                    const viewBox = descr.icon === 'CCBY' || descr.icon === 'copyright-1' ?
                        '0 0 20 20' :
                        '0 0 18 18';
                    return (
                      <div key={descr.icon} data-tip={descr.text} >
                        <IconButton
                          style={{ padding: '6px', width: '30px', height: '30px' }}
                          iconStyle={{ width: '18px', height: '18px' }}
                        >
                          <SvgIcon viewBox={viewBox}>
                            {React.createElement(licenseIcons[descr.icon])}
                          </SvgIcon>
                        </IconButton>
                      </div>
                    );
                }
            })}
          </div>
        );
    };

    render () {
        const { entry, licenses } = this.props;
        const newEditorState = editorStateFromRaw(entry.getIn(['content', 'draft']));
        const editorState = EditorState.push(this.editorState, newEditorState.getCurrentContent());
        const license = licenses.get(entry.content.licence.id);
        const licenseLabel = license.parent ?
            licenses.get(license.parent).label :
            license.label;
        return (
          <div>
            <div className={`${styles.content_inner} row`} >
              <div className="col-xs-12">
                <h1 className={styles.entry_title}>
                  {entry.getIn(['content', 'title'])}
                </h1>
              </div>
              <div className={`${styles.entry_content} col-xs-12`} >
                <MegadraftEditor
                  readOnly
                  editorState={editorState}
                  onChange={() => {}}
                  plugins={[readOnlyImagePlugin]}
                />
              </div>
            </div>
            <div
              className={styles.entry_infos}
              style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}
            >
              <span style={{ paddingRight: '10px' }}>
                {licenseLabel}
              </span>
              {this.renderLicenseIcons()}
            </div>
            <div className={styles.entry_infos}>
              <div className={styles.entry_tags}>
                {entry.getIn(['content', 'tags']).map(tag => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    onTagClick={this.navigateToTag}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
}

EntryPageContent.propTypes = {
    entry: PropTypes.shape(),
    history: PropTypes.shape(),
    licenses: PropTypes.shape()
};

export default withRouter(EntryPageContent);
