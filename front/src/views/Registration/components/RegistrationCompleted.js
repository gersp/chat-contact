import React from 'react';
import { Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from '../Registration';

const RegistrationCompleted = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.contentBody}>
          <div className={classes.form}>
            <Typography className={classes.title} variant='h2'>
              Аккаунт зарегистрирован.
            </Typography>
            <Typography className={classes.title}>
              На почту выслана ссылка для подтверждения регистрации. Пройдите по ней, и после этого сможете пользоваться
              продуктом.
            </Typography>
            <Link color='primary' component={RouterLink} to='/sign-in' underline='always' variant='h6'>
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCompleted;
