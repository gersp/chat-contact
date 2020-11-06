import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from '@material-ui/pickers';
import { Controller } from 'react-hook-form';
import { valueByName } from './form_utils';

export const ECDateTimeField = props => {
  const { name, label, form, defaultValue, initial, ...rest } = props;

  const dv = defaultValue || (initial && valueByName(initial, name)) || new Date().toJSON();

  return (
    <Controller
      as={DateTimePicker}
      control={form.control}
      label={label}
      name={name}
      fullWidth
      margin='dense'
      inputVariant='outlined'
      helperText={form.errors[name] && form.errors[name].message}
      error={!!form.errors[name]}
      onChange={([v]) => {
        return v.toJSON();
      }}
      defaultValue={new Date(dv)}
      ampm={false}
      disablePast
      format={'D MMMM YYYY HH:mm'}
      {...rest}
    />
  );
};

ECDateTimeField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  form: PropTypes.object,
  defaultValue: PropTypes.any,
  initial: PropTypes.object,
};
