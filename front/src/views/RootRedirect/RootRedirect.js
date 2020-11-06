import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AppContext } from '../../AppContext';

const RootRedirect = () => {
  const appContext = useContext(AppContext);

  if (appContext.loading) {
    return <>waiting for session...</>;
  }
  if (!appContext.session) {
    return <Redirect to='/sign-in' />;
  } else {
    return <Redirect to='/chat' />;
  }
};

export default RootRedirect;
