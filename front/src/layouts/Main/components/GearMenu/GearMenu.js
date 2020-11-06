import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { ListItemText, IconButton, MenuItem } from '@material-ui/core';
import GearIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  topBarIcon: {
    marginRight: theme.spacing(1),
  },
}));

const GearMenu = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <Fragment>
      <IconButton {...props} className={classes.topBarIcon} onClick={handleMenuOpen} size='small' color='inherit'>
        <GearIcon />
      </IconButton>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        classes={{ paper: classes.menu }}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
      >
        <RouterLink to='/meetup'>
          <MenuItem>
            <ListItemText primary='Мероприятия' />
          </MenuItem>
        </RouterLink>
        <RouterLink to='/badge'>
          <MenuItem>
            <ListItemText primary='Шаблоны документов' />
          </MenuItem>
        </RouterLink>
        <RouterLink to='/user'>
          <MenuItem>
            <ListItemText primary='Администраторы' />
          </MenuItem>
        </RouterLink>
      </Popover>
    </Fragment>
  );
};

GearMenu.propTypes = {
  className: PropTypes.string,
};

export default memo(GearMenu);
