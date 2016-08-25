import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardText,
    CardActions,
    FlatButton,
    IconButton,
    Chip } from 'material-ui';
import ThumbUpIcon from 'material-ui/svg-icons/action/thumb-up';
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import ShareIcon from 'material-ui/svg-icons/social/share';
import StarIcon from 'material-ui/svg-icons/action/bookmark-border';

class Stream extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
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
          <div className="row">
            <div className="col-xs-12">
              <div className="row center-xs">
                <div className="col-xs-10" style={{ padding: '24px 0' }}>
                  <div>
                    <Card className="start-xs" style={{ marginBottom: 16 }}>
                      <CardHeader
                        title="Andrei Biga"
                        subtitle="1 day ago - 5 min read (333 words)"
                        avatar="http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg"
                      />
                      <CardTitle
                        style={{ padding: '0 16px 8px' }}
                        title="Fight or flight? The battle for Internet’s freedom"
                      />
                      <CardText style={{ padding: '0 16px 8px' }}>
                        <div style={{ marginBottom: 8 }}>
                          <Chip style={tagStyle}>mathematics</Chip>
                          <Chip style={tagStyle}>blockchain</Chip>
                          <Chip style={tagStyle}>movies</Chip>
                          <Chip style={tagStyle}>sports</Chip>
                        </div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate (…)
                      </CardText>
                      <CardActions className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-7">
                            <FlatButton label="159" icon={<ThumbUpIcon />} />
                            <FlatButton label="3" icon={<ThumbDownIcon />} />
                            <FlatButton label="0" icon={<CommentIcon />} />
                            <FlatButton label="2" icon={<ShareIcon />} />
                          </div>
                          <div className="col-xs-5 end-xs">
                            <IconButton><StarIcon /></IconButton>
                          </div>
                        </div>
                      </CardActions>
                    </Card>
                      <Card className="start-xs" style={{ marginBottom: 16 }}>
                          <CardHeader
                              title="Andrei Biga"
                              subtitle="1 day ago - 5 min read (333 words)"
                              avatar="http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg"
                          />
                          <CardTitle
                              style={{ padding: '0 16px 8px' }}
                              title="Fight or flight? The battle for Internet’s freedom"
                          />
                          <CardText style={{ padding: '0 16px 8px' }}>
                              <div style={{ marginBottom: 8 }}>
                                  <Chip style={tagStyle}>mathematics</Chip>
                                  <Chip style={tagStyle}>blockchain</Chip>
                                  <Chip style={tagStyle}>movies</Chip>
                                  <Chip style={tagStyle}>sports</Chip>
                              </div>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                              tempor incididunt ut labore et dolore magna aliqua.
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                              reprehenderit in voluptate (…)
                          </CardText>
                          <CardActions className="col-xs-12">
                              <div className="row">
                                  <div className="col-xs-7">
                                      <FlatButton label="159" icon={<ThumbUpIcon />} />
                                      <FlatButton label="3" icon={<ThumbDownIcon />} />
                                      <FlatButton label="0" icon={<CommentIcon />} />
                                      <FlatButton label="2" icon={<ShareIcon />} />
                                  </div>
                                  <div className="col-xs-5 end-xs">
                                      <IconButton><StarIcon /></IconButton>
                                  </div>
                              </div>
                          </CardActions>
                      </Card>
                      <Card className="start-xs" style={{ marginBottom: 16 }}>
                          <CardHeader
                              title="Andrei Biga"
                              subtitle="1 day ago - 5 min read (333 words)"
                              avatar="http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg"
                          />
                          <CardTitle
                              style={{ padding: '0 16px 8px' }}
                              title="Fight or flight? The battle for Internet’s freedom"
                          />
                          <CardText style={{ padding: '0 16px 8px' }}>
                              <div style={{ marginBottom: 8 }}>
                                  <Chip style={tagStyle}>mathematics</Chip>
                                  <Chip style={tagStyle}>blockchain</Chip>
                                  <Chip style={tagStyle}>movies</Chip>
                                  <Chip style={tagStyle}>sports</Chip>
                              </div>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                              tempor incididunt ut labore et dolore magna aliqua.
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                              reprehenderit in voluptate (…)
                          </CardText>
                          <CardActions className="col-xs-12">
                              <div className="row">
                                  <div className="col-xs-7">
                                      <FlatButton label="159" icon={<ThumbUpIcon />} />
                                      <FlatButton label="3" icon={<ThumbDownIcon />} />
                                      <FlatButton label="0" icon={<CommentIcon />} />
                                      <FlatButton label="2" icon={<ShareIcon />} />
                                  </div>
                                  <div className="col-xs-5 end-xs">
                                      <IconButton><StarIcon /></IconButton>
                                  </div>
                              </div>
                          </CardActions>
                      </Card>
                      <Card className="start-xs" style={{ marginBottom: 16 }}>
                          <CardHeader
                              title="Andrei Biga"
                              subtitle="1 day ago - 5 min read (333 words)"
                              avatar="http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg"
                          />
                          <CardTitle
                              style={{ padding: '0 16px 8px' }}
                              title="Fight or flight? The battle for Internet’s freedom"
                          />
                          <CardText style={{ padding: '0 16px 8px' }}>
                              <div style={{ marginBottom: 8 }}>
                                  <Chip style={tagStyle}>mathematics</Chip>
                                  <Chip style={tagStyle}>blockchain</Chip>
                                  <Chip style={tagStyle}>movies</Chip>
                                  <Chip style={tagStyle}>sports</Chip>
                              </div>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                              tempor incididunt ut labore et dolore magna aliqua.
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                              reprehenderit in voluptate (…)
                          </CardText>
                          <CardActions className="col-xs-12">
                              <div className="row">
                                  <div className="col-xs-7">
                                      <FlatButton label="159" icon={<ThumbUpIcon />} />
                                      <FlatButton label="3" icon={<ThumbDownIcon />} />
                                      <FlatButton label="0" icon={<CommentIcon />} />
                                      <FlatButton label="2" icon={<ShareIcon />} />
                                  </div>
                                  <div className="col-xs-5 end-xs">
                                      <IconButton><StarIcon /></IconButton>
                                  </div>
                              </div>
                          </CardActions>
                      </Card>
                      <Card className="start-xs" style={{ marginBottom: 16 }}>
                          <CardHeader
                              title="Andrei Biga"
                              subtitle="1 day ago - 5 min read (333 words)"
                              avatar="http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg"
                          />
                          <CardTitle
                              style={{ padding: '0 16px 8px' }}
                              title="Fight or flight? The battle for Internet’s freedom"
                          />
                          <CardText style={{ padding: '0 16px 8px' }}>
                              <div style={{ marginBottom: 8 }}>
                                  <Chip style={tagStyle}>mathematics</Chip>
                                  <Chip style={tagStyle}>blockchain</Chip>
                                  <Chip style={tagStyle}>movies</Chip>
                                  <Chip style={tagStyle}>sports</Chip>
                              </div>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                              tempor incididunt ut labore et dolore magna aliqua.
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                              reprehenderit in voluptate (…)
                          </CardText>
                          <CardActions className="col-xs-12">
                              <div className="row">
                                  <div className="col-xs-7">
                                      <FlatButton label="159" icon={<ThumbUpIcon />} />
                                      <FlatButton label="3" icon={<ThumbDownIcon />} />
                                      <FlatButton label="0" icon={<CommentIcon />} />
                                      <FlatButton label="2" icon={<ShareIcon />} />
                                  </div>
                                  <div className="col-xs-5 end-xs">
                                      <IconButton><StarIcon /></IconButton>
                                  </div>
                              </div>
                          </CardActions>
                      </Card>
                  </div>
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
