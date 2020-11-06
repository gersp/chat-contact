import React from 'react';
import { Typography } from '@material-ui/core';
import { useStyles } from '../Registration';

const ConfirmationFailed = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.contentBody}>
          <div className={classes.form}>
            <Typography className={classes.title} variant='h2'>
              Подтверждение не выполнено.
            </Typography>
            <Typography className={classes.title}>Ссылка не валидна. Ссылка уже подтверждена или устарела.</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationFailed;
