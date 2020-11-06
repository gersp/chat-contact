import React from 'react';
import { Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from '../Registration';

const RegistrationConfirmed = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.contentBody}>
          <div className={classes.form}>
            <Typography className={classes.title} variant='h2'>
              Аккаунт подтверждён.
            </Typography>
            <Typography className={classes.title}>Можете пользоваться.</Typography>
            <Link color='primary' component={RouterLink} to='/sign-in' underline='always' variant='h6'>
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmed;
