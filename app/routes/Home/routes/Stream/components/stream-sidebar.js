import React from 'react';
import { List, Subheader, Chip, FlatButton } from 'material-ui';

class StreamSidebar extends React.Component {
    constructor (props) {
        super (props);
    }
    render () {
        const tagStyle = {
            display: 'inline-block',
            border: '1px solid',
            borderColor: '#DDD',
            backgroundColor: '#FFF',
            borderRadius: 3,
            height: 34,
            verticalAlign: 'middle',
            marginRight: '4px',
            marginBottom: '4px'
        };
        return (
          <div
            className="row center-xs"
            style={{
                background: '#F5F5F5',
                position: 'fixed',
                top: 45,
                bottom: 0
            }}
          >
            <div className="col-xs-12">
              <Subheader className="row start-xs middle-xs">
                <small
                  className="start-xs col-xs-8"
                >
                    FOLLOWED TAGS
                </small>
                <div className="col-xs-4 end-xs">
                  <FlatButton>
                      <small>+ADD NEW</small>
                  </FlatButton>
                </div>
              </Subheader>
              <div className="start-xs" style={{paddingLeft: 16}}>
                <Chip style={tagStyle}>mathematics</Chip>
                <Chip style={tagStyle}>blockchain</Chip>
                <Chip style={tagStyle}>movies</Chip>
                <Chip style={tagStyle}>sports</Chip>
                <Chip style={tagStyle}>moon</Chip>
                <Chip style={tagStyle}>short-story</Chip>
              </div>
              <Subheader className="start-xs row">
                <small className="start-xs col-xs-8">RECOMMENDED TAGS</small>
              </Subheader>
              <div className="start-xs" style={{paddingLeft: 16}}>
                <Chip style={tagStyle}>mathematics</Chip>
                <Chip style={tagStyle}>blockchain</Chip>
                <Chip style={tagStyle}>movies</Chip>
                <Chip style={tagStyle}>sports</Chip>
                <Chip style={tagStyle}>moon</Chip>
              </div>
            </div>
          </div>
        );
    }
}

export default StreamSidebar;
