import React, { useContext, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import { AppContext } from '../../../../AppContext';
import MeetupSelector from '../MeetupSelector/MeetupSelector';
import GearMenu from '../GearMenu/GearMenu';
import useTheme from '@material-ui/core/styles/useTheme';
import { AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    flexSrink: 0,
    position: 'relative',
  },
  flexGrow: {
    flexGrow: 1,
  },
  topBarIcon: {
    marginRight: theme.spacing(1),
  },
  logo: {
    zIndex: 5,
    '&:focus': {
      outline: '2px solid gray',
      outlineOffset: 5,
    },
  },
}));

const Topbar = props => {
  const { className, ...rest } = props;
  const theme = useTheme();

  const classes = useStyles();

  const [notifications] = useState([]);
  const appContext = useContext(AppContext);

  const handleSignOut = event => {
    event.preventDefault();
    appContext.logout();
  };

  return (
    <AppBar
      {...rest}
      style={{ background: appContext.session && appContext.session.superAdmin && '#702a2a' }}
      color={theme.appBarColor}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to='/' className={classes.logo}>
          <img alt='Logo' src={theme.topLogo} width={theme.topLogoWidth || '100%'} />
        </RouterLink>

        <div className={classes.flexGrow} />

        <MeetupSelector />

      
        <GearMenu />
        <RouterLink to='/profile/account' tabIndex={-1}>
          <IconButton
            className={classes.topBarIcon}
            style={{ color: theme.palette[theme.appBarColor].contrastText }}
            onClick={() => {}}
          >
            <AccountCircle />
          </IconButton>
        </RouterLink>
        <IconButton
          className={classes.topBarIcon}
          style={{ color: theme.palette[theme.appBarColor].contrastText }}
          onClick={handleSignOut}
        >
          <InputIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
