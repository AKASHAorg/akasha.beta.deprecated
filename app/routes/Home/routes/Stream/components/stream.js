import React from 'react';

class Stream extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps (nextProps) {
        console.log(nextProps, nextProps.params, 'nextProps');
    }
    render () {
        return (
          <div className="row" style={{ position: 'absolute', top: 0, left: 12, right: 7, bottom: 45, overflowY: 'auto' }}>
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
    filter: React.PropTypes.string
};
export default Stream;
