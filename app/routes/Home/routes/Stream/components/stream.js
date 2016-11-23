import React, { PropTypes } from 'react';
import styles from './stream.scss';

class Stream extends React.Component {
    render () {
        return (
          <div className={`row ${styles.root}`}>
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
    children: PropTypes.node
};
export default Stream;
