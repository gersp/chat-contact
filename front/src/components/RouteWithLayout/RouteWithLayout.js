import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppContext } from '../../AppContext';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, auth, desk, feature, ...rest } = props;
  const appContext = useContext(AppContext);
  return (
    <Route
      {...rest}
      render={matchProps => {
        if (
          !auth ||
          (appContext.session &&
            appContext.session.permissions.indexOf(auth) !== -1 &&
            (!appContext.session.features ||
              !feature ||
              (appContext.session.features && appContext.session.features.includes(feature))))
        ) {
          console.log('childred')
          return (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          );
        } else {
          console.log('null')
          if (!appContext.loading) {
            if (!appContext.session) {
              // redirect to sign-in
              appContext.history.push('/sign-in');
            } else {
              // show 403
              appContext.history.push('/sign-in');
            }
          } else {
            return null;
          }
        }
      }}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  auth: PropTypes.string,
};

export default RouteWithLayout;
