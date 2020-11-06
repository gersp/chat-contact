import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { AppContext } from '../../AppContext';
import MeetupsToolbar from './components/MeetupsToolbar/MeetupsToolbar';
import MeetupsTable from './components/MeetupsTable/MeetupsTable';
import { Route } from 'react-router-dom';
import MeetupEdit from './components/MeetupEdit/MeetupEdit';
import MeetupAdd from './components/MeetupAdd/MeetupAdd';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

const MeetupList = () => {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  // retrieve users list
  const [meetups, setMeetups] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const refresh = () => {
    appContext.meetupApi
      .listMeetups(showAll)
      .then(({ data }) => {
        setMeetups(data);
      })
      .catch(appContext.errorHandler);
  };
  useEffect(refresh, [showAll]);

  const [meetupDeleteConfirmation, setMeetupDeleteConfirmation] = useState(null);

  const handleDelete = meetupId => {
    setMeetupDeleteConfirmation(meetupId);
  };

  const handleDeleteFinal = () => {
    appContext.meetupApi.deleteMeetup(meetupDeleteConfirmation).then(() => {
      setMeetups(meetups => meetups.filter(u => u.meetupId !== meetupDeleteConfirmation));
      setMeetupDeleteConfirmation(null);
    });
  };

  const backAndRefresh = data => {
    appContext.history.push('/meetup');
    if (data) {
      refresh();
    }
  };

  return (
    <div className={classes.root}>
      <MeetupsToolbar showAll={showAll} setShowAll={setShowAll} />
      <MeetupsTable meetups={meetups} handleDelete={handleDelete} />

      <ConfirmationDialog
        title='Закрыть мероприятие'
        message='Закрытое мероприятие не будет отображаться в списке всех мероприятий. Закрыть мероприятие?'
        ok={handleDeleteFinal}
        cancel={() => setMeetupDeleteConfirmation(null)}
        show={!!meetupDeleteConfirmation}
      />

      <Route path='/meetup/add' exact>
        <MeetupAdd goBack={backAndRefresh} />
      </Route>

      <Route path='/meetup/id/:meetupId' exact>
        <MeetupEdit goBack={backAndRefresh} />
      </Route>
    </div>
  );
};

export default MeetupList;
