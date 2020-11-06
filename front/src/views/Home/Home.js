import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: '0 auto'
  },
  countersContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 50
  },
  counter: {
    width: 250,
    height: 250,
    padding: 10,

    marginRight: 30,
    display: 'flex',
    flexDirection: 'column'
  },
  counter__name: {
    textAlign: 'center',
    fontSize: 20,
    flexShrink: 0
  },
  counter__count: {
    fontSize: 85,
    flexGrow: 1,
    fontWeight: 'bold',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'

  }
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.countersContainer}>
        <Card className={classes.counter}>
          <Typography className={classes.counter__name}>
            Количество анкет
          </Typography>
          <Typography className={classes.counter__count}>
            148
          </Typography>
        </Card>
        <Card className={classes.counter}>
          <Typography className={classes.counter__name}>
            Количество матчей
          </Typography>
          <Typography className={classes.counter__count}>
            56
          </Typography>
        </Card>
      </div>
    </div>
  )
}

export default Home;