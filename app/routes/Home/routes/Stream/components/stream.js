import React from 'react';
import styles from './stream.scss';

class Stream extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            pagination: {}
        };
    }
    render () {
        return (
          <div
            className={`row ${styles.root}`}
          >
            <div className="col-xs-12">
              <div className="row center-xs">
                <div className="col-xs-10" style={{ padding: '24px 0' }}>
                  {this.props.children}
                </div>
              </div>
            </div>
          </div>
        );
    }
}
Stream.propTypes = {
    filter: React.PropTypes.string,
    children: React.PropTypes.node
};
export default Stream;
