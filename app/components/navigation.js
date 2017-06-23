import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const Navigation = ({ location, match }, { muiTheme }) => {
    const { palette } = muiTheme;
    const withoutQuery = location.pathname.split('?')[0];
    const parts = withoutQuery.split('/').filter(p => !!p);
    let base = '';
    const routes = parts.map((part) => {
        base = `${base}/${part}`;
        return base;
    });

    return (
      <div className="flex-center-y" style={{ height: '100%' }}>
        {parts.map((part, index) => {
            const isLast = index === parts.length - 1;
            return (
              <span key={routes[index]}>
                <Link to={routes[index]}>
                  <span
                    style={{
                        fontWeight: isLast && '600',
                        color: isLast ? palette.textColor : palette.disabledColor
                    }}
                  >
                    {part}
                  </span>
                </Link>
                {!isLast &&
                  <span style={{ color: palette.disabledColor, padding: '0 10px' }}>
                    {'>'}
                  </span>
                }
              </span>
            );
        })}
      </div>
    );
};

Navigation.contextTypes = {
    muiTheme: PropTypes.shape()
};

Navigation.propTypes = {
    location: PropTypes.shape(),
    match: PropTypes.shape(),
};

export default withRouter(Navigation);
