import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { AppContext } from '../../../../../../AppContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    marginTop: theme.spacing(1),
  },
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const appContext = useContext(AppContext);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography className={classes.name} variant='h4'>
        {appContext.session.displayName}
      </Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
