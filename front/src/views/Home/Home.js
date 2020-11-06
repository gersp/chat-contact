import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: '0 auto'
  },
  countersContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  counter: {
    width: 200,
    height: 200,
    marginRight: 20
  }
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.countersContainer}>
        <Card className={classes.counter}></Card>
        <Card className={classes.counter}></Card>
      </div>
    </div>
  )
}

export default Home;