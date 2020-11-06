import { TextField } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { valueByName } from './form_utils';

export const ECTextField = props => {
  const { name, label, form, defaultValue, initial, ...rest } = props;

  const dv = defaultValue || (initial && valueByName(initial, name)) || '';
  return (
    <TextField
      label={label}
      name={name}
      fullWidth
      margin='dense'
      variant='outlined'
      inputRef={form.register}
      helperText={form.errors[name] && form.errors[name].message}
      error={!!form.errors[name]}
      defaultValue={dv}
      {...rest}
    />
  );
};

ECTextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  form: PropTypes.object,
  defaultValue: PropTypes.any,
  initial: PropTypes.object,
};
