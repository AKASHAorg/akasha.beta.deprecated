import React from 'react';
import { TextField, Chip, SelectField, MenuItem } from 'material-ui';

const tagStyle = {
    display: 'inline-block',
    border: '1px solid',
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 3,
    height: 34,
    verticalAlign: 'middle',
    marginRight: '4px',
    marginBottom: '4px',
    position: 'absolute',
    right: 0,
    top: 25,
    cursor: 'pointer'
};
const TagSearch = (props) =>
  <div className="row" style={{ paddingBottom: 24 }}>
    <div className="col-xs-12" style={{ position: 'relative' }}>
      <TextField
        fullWidth
        hintText="Type a tag"
        floatingLabelText="TAGGED IN"
        value={props.tagName.toUpperCase()}
      />
      <Chip style={tagStyle}>Following</Chip>
    </div>
    <div className="col-xs-12">
      <div className="row middle-xs">
        <div className="col-xs-4">
          <div className="row middle-xs">
            <span className="col-xs-3">Show:</span>
            <SelectField className="col-xs-7">
              <MenuItem label="All entries" />
            </SelectField></div>
        </div>
        <div className="col-xs-4">
          <div className="row middle-xs">
            <span className="col-xs-4">Sort by:</span>
            <SelectField className="col-xs-6">
              <MenuItem label="Latest" />
            </SelectField>
          </div>
        </div>
        <div className="col-xs-4 end-xs">321 followers</div>
      </div>
    </div>
  </div>;

TagSearch.propTypes = {
    tagName: React.PropTypes.string,
    onChange: React.PropTypes.func
};
export default TagSearch;
