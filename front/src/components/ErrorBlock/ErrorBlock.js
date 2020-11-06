import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
    textAlign: 'center',
    backgroundColor: theme.palette.error.light,
    '& p': {
      color: 'white',
    },
  },
}));

const ErrorBlock = props => {
  const { message } = props;

  const classes = useStyles();

  if (!message) return null;
  return (
    <Paper className={classes.root}>
      <Typography component='p'>{message}</Typography>
    </Paper>
  );
};

ErrorBlock.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
};

ErrorBlock.defaultProps = {};

export default ErrorBlock;
