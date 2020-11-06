import React, { useContext, useEffect, useState } from 'react';
import ModalDialog from '../../../../components/ModalDialog/ModalDialog';
import { AppContext } from '../../../../AppContext';
import { useParams } from 'react-router-dom';
import MeetupEditForm from '../MeetupEditForm/MeetupEditForm';
import { useForm } from 'react-hook-form';
import { errorsToForm } from '../../../../components/Forms/form_utils';

const MeetupEdit = props => {
  const appContext = useContext(AppContext);
  const { meetupId } = useParams();
  const { goBack } = props;
  const form = useForm();

  const [initial, setData] = useState(undefined);
  useEffect(() => {
    appContext.meetupApi.getMeetup(meetupId).then(({ data }) => {
      setData(data);
    });
  }, [meetupId]);

  const handleSave = data => {
    data.meetupId = meetupId;
    data.closed = false;
    appContext.meetupApi
      .updateMeetup(meetupId, data)
      .then(({ data }) => {
        goBack(data);
      })
      .catch(errorsToForm(form));
  };

  if (!initial) {
    return null;
  }

  return (
    <ModalDialog
      title={'Редактирование мероприятия'}
      okButtonText={'Сохранить'}
      handleOk={form.handleSubmit(handleSave)}
      handleClose={goBack}
    >
      <MeetupEditForm form={form} initial={initial} />
    </ModalDialog>
  );
};

MeetupEdit.propTypes = {};

export default MeetupEdit;
