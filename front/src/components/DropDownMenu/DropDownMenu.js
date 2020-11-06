import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles(() => ({}));

const DropDownMenu = props => {
  const { size } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(undefined);
  };

  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <IconButton {...props} onClick={handleMenuOpen} size={size ? size : 'small'}>
        <MoreIcon />
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
        open={open}
        anchorEl={anchorEl}
      >
        {props.children}
      </Popover>
    </Fragment>
  );
};

DropDownMenu.propTypes = {
  className: PropTypes.string,
};

export default DropDownMenu;
