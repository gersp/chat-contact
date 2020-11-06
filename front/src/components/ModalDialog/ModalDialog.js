import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'scroll',
  },
  paper: {
    boxShadow: theme.shadows[5],
    margin: 'auto',
    padding: theme.spacing(2, 4, 2),
  },
  bottomDiv: {
    textAlign: 'center',
  },
  divider1: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  divider2: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  space: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const ModalDialog = props => {
  const { okButtonText, title, children, handleOk, handleClose, size, noButtons, noDivider, open } = props;
  const classes = useStyles();
  let showStatus = open;

  let width = 800;
  if (size === 'xs') width = 400;
  if (size === 'sm') width = 600;
  if (size === 'md') width = 800;
  if (size === 'lg') width = 1220;
  if (size === 'xl') width = 1400;

  if (typeof open !== 'boolean') {
    showStatus = true;
  }

  return (
    <Modal open={showStatus} className={classes.modal} onClose={() => handleClose && handleClose()}>
      <Paper className={classes.paper} style={{ width: width }}>
        <Typography variant='h3'>{title}</Typography>
        { noDivider || <Divider className={classes.divider1} /> }

        {children}

        { noDivider || <Divider className={classes.divider2} /> }
        <div className={classes.bottomDiv}>
          {handleClose && !noButtons && (
            <Button color='secondary' variant='contained' className={classes.space} onClick={() => handleClose()}>
              Отменить
            </Button>
          )}
          {handleOk && !noButtons && (
            <Button color='primary' variant='contained' className={classes.space} onClick={() => handleOk()}>
              {okButtonText || 'Ok'}
            </Button>
          )}
        </div>
      </Paper>
    </Modal>
  );
};

ModalDialog.propTypes = {
  title: PropTypes.string,
  okButtonText: PropTypes.string,
  handleOk: PropTypes.func,
  handleClose: PropTypes.func,
};

export default ModalDialog;
