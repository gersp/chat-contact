import React, { useContext } from 'react';
import ModalDialog from '../../../../components/ModalDialog/ModalDialog';
import { AppContext } from '../../../../AppContext';
import MeetupEditForm from '../MeetupEditForm/MeetupEditForm';
import { useForm } from 'react-hook-form';
import { errorsToForm } from '../../../../components/Forms/form_utils';
import moment from 'moment-timezone';

const MeetupAdd = props => {
  const { goBack } = props;
  const appContext = useContext(AppContext);
  const form = useForm();

  const initial = {
    name: 'Новое мероприятие',
    startTime: new Date(new Date().setHours(18, 0, 0, 0)).toJSON(),
    endTime: new Date(new Date().setHours(19, 0, 0, 0)).toJSON(),
    timezone: moment.tz.guess(),
  };

  const handleSave = data => {
    data.timezone = initial.timezone;
    console.log(data);
    appContext.meetupApi
      .createMeetup(data)
      .then(({ data }) => {
        goBack(data);
      })
      .catch(errorsToForm(form));
  };

  return (
    <ModalDialog
      title={'Добавление мероприятия'}
      okButtonText={'Сохранить'}
      handleOk={form.handleSubmit(handleSave)}
      handleClose={goBack}
    >
      <MeetupEditForm form={form} initial={initial} />
    </ModalDialog>
  );
};

MeetupAdd.propTypes = {};

export default MeetupAdd;
