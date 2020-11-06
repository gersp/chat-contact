import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, TextField, Typography } from '@material-ui/core';
import { ECCommonErrorBlock } from '../../../../components/Forms/ECCommonErrorBlock';
import { ECTextField } from '../../../../components/Forms/ECTextField';
import { ECDateTimeField } from '../../../../components/Forms/ECDateTimeField';
import { ECSelectField } from '../../../../components/Forms/ECSelectField';
import moment from 'moment-timezone';

export const convertErrors = (errors, idx) => {
  console.log(errors);
  if (!errors || errors.length === 0) {
    return {
      isValid: true,
      errors: {},
      touched: {},
    };
  }

  const fieldErrors = {};
  const touched = {};
  let mainError = null;
  errors.forEach(e => {

    if (e.args.field !== 'fields') {
      let idx2;
      if (idx) {
        idx = idx.toString();
        idx2 = [...e.args.field.matchAll(/fields\[(\d+)\].*/g)];
        idx2 = idx2[0][1];
      }
      let fieldName = idx ? e.args.field.slice(e.args.field.indexOf('.') + 1) : e.args.field;
      if (!fieldErrors[e.args.field] && (idx ? idx === idx2 : true)) {
        fieldErrors[fieldName] = e.message;
        touched[fieldName] = true;
      }
    } else if (mainError === null) {
      console.log(e.args.field !== 'fields', mainError)
      mainError = e.message;
    }
  });

  let ret = {
    isValid: false,
    error: mainError,
    errors: fieldErrors,
    touched: touched,
  };
  return ret;
};

// TODO: remove and migrate to react-hook-form
export const MyFormTextField = props => {
  const { data: formData, name, label, handleChange, error, ...rest } = props;

  const parts = name.split('.');
  let val = formData.values;
  parts.forEach(p => (val = val[p]));
  return (
    <TextField
      label={label}
      {...rest}
      fullWidth
      margin='dense'
      variant='outlined'
      autoComplete='new-password'
      helperText={error(name)}
      error={error(name) != null}
      onChange={e => handleChange(name, e.target.value)}
      value={val}
    />
  );
};

const MeetupEditForm = props => {
  const { form, initial } = props;

  return (
    <>
      <ECCommonErrorBlock form={form} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ECTextField label='Название мероприятия' name='name' form={form} initial={initial} />
        </Grid>
        <Grid item xs={6}>
          <ECDateTimeField label='Дата начала' name='startTime' form={form} initial={initial} />
        </Grid>
        <Grid item xs={6}>
          <ECDateTimeField label='Дата начала' name='endTime' form={form} initial={initial} />
        </Grid>
        <Grid item xs={12}>
          <ECSelectField
            label='Часовой пояс'
            name='timezone'
            options={moment.tz.names()}
            fid={e => e}
            fname={e => e}
            form={form}
            initial={initial}
          />
        </Grid>

        {initial.closed ? (
          <Grid item xs={12}>
            <Typography>Мероприятие закрыто</Typography>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default MeetupEditForm;
