import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppContext } from '../../../../AppContext';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'center',
  },
  color: {
    color: 'inherit',
  },
}));

const MeetupSelector = props => {
  const classes = useStyles();

  const appContext = useContext(AppContext);
  const { mid } = useParams();

  const [meetupInfo, setMeetupInfo] = useState(null);
  useEffect(() => {
    if (mid) {
      appContext.meetupApi
        .getMeetup(mid)
        .then(({ data }) => {
          setMeetupInfo(data);
        })
        .catch(appContext.errorHandler);
    } else {
      setMeetupInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid]);

  if (mid && !meetupInfo) {
    return null;
  }

  return (
    <div className={clsx(classes.root)}>
      <Typography variant='h4' className={clsx(classes.color)}>
        {mid ? meetupInfo.name : window.location.pathname.startsWith('/meetup') ? '' : ''}
      </Typography>
    </div>
  );
};

MeetupSelector.propTypes = {
  className: PropTypes.string,
};

export default MeetupSelector;
