import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { valueByName } from './form_utils';
import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import moment from 'moment';

export const ECMultiDateField = props => {
  const { name, label, form, defaultValue, initial, ...rest } = props;

  const dv = defaultValue || (initial && valueByName(initial, name)) || [];

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [value, setValue] = useState(dv);

  useEffect(() => {
    form.register({ name: name });
    form.setValue(name, dv);
  }, [form.register]);

  const applyDates = dates => {
    console.log(dates);

    const short = dates.map(d => moment(d).format('YYYY-MM-DD'));

    form.setValue(name, short);

    setValue(short);
    setDatePickerOpen(false);
  };

  const valuesAsDates = () => {
    return value.map(v => new Date(v));
  };

  return (
    <>
      <TextField
        label={label}
        name={name}
        fullWidth
        margin='dense'
        variant='outlined'
        helperText={form.errors[name] && form.errors[name].message}
        error={!!form.errors[name]}
        value={value}
        onClick={() => setDatePickerOpen(true)}
        {...rest}
      />

      <MultipleDatesPicker
        open={datePickerOpen}
        selectedDates={valuesAsDates()}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
        onSubmit={applyDates}
        submitButtonText={'Сохранить'}
        cancelButtonText={'Отменить'}
        selectedDatesTitle={'Даты'}
      />
    </>
  );
};

ECMultiDateField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  form: PropTypes.object,
  defaultValue: PropTypes.any,
  initial: PropTypes.object,
};
