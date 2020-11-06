import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
}));

const Empty = props => {
  const { children } = props;

  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

Empty.propTypes = {
  children: PropTypes.node,
};

export default Empty;
