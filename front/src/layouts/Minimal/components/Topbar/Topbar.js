import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
  },
}));

const Topbar = props => {
  const { className, ...rest } = props;
  const theme = useTheme();

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color={theme.appBarColor} position='fixed'>
      <Toolbar>
        <RouterLink to='/'>
          <img alt='Logo' src={theme.topLogo} width={theme.topLogoWidth || '100%'} />
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
};

export default Topbar;
