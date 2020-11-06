import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
  },
  spacer: {
    flexGrow: 1,
  },
}));

const MeetupsToolbar = props => {
  const { className, showAll, setShowAll, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showAll}
              onChange={() => {
                setShowAll(!showAll);
              }}
              color='primary'
            />
          }
          label='Показывать закрытые'
        />

        <span className={classes.spacer} />
        <RouterLink to='/meetup/add'>
          <Button color='primary' variant='contained'>
            Создать мероприятие
          </Button>
        </RouterLink>
      </div>
    </div>
  );
};

MeetupsToolbar.propTypes = {
  className: PropTypes.string,
};

export default MeetupsToolbar;
