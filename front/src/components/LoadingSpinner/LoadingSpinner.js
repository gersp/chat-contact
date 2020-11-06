import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
}));

const LoadingSpinner = props => {
  const classes = useStyles();

  return (
    <Grid container spacing={0} direction='column' alignItems='center' justify='center' style={{ minHeight: '100vh' }}>
      <CircularProgress className={classes.progress} />
    </Grid>
  );
};

export default LoadingSpinner;
