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

export const ECCommonErrorBlock = props => {
  const { form } = props;

  const classes = useStyles();
  console.log(form);

  if (!form.errors) return null;

  const errorKeys = Object.keys(form.errors);
  const fieldKeys = Object.keys(form.getValues());
  const alienKeys = errorKeys.filter(e => e === '_' || fieldKeys.indexOf(e) === -1);

  if (alienKeys.length === 0) return null;
  return (
    <Paper className={classes.root}>
      {alienKeys.map((k, i) => (
        <Typography component='p' key={i}>
          {!!k && k !== '_' && <>{k}:</>}
          {form.errors[k].message}
        </Typography>
      ))}
    </Paper>
  );
};

ECCommonErrorBlock.propTypes = {
  className: PropTypes.string,
  form: PropTypes.object,
};
