import { MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { valueByName } from './form_utils';

export const ECSelectField = props => {
  const { name, label, options, form, fid: a1, fname: a2, defaultValue, initial, ...rest } = props;
  const fname =
    props.fname ||
    (it => {
      return it.name;
    });
  const fid =
    props.fid ||
    (it => {
      return it.id;
    });

  const dv = defaultValue || (initial && valueByName(initial, name)) || '';
  return (
    <Controller
      as={TextField}
      control={form.control}
      label={label}
      name={name}
      select
      fullWidth
      margin='dense'
      variant='outlined'
      helperText={form.errors[name] && form.errors[name].message}
      error={!!form.errors[name]}
      defaultValue={dv}
      {...rest}
    >
      {options.map(it => (
        <MenuItem key={fid(it)} value={fid(it)}>
          {fname(it)}
        </MenuItem>
      ))}
    </Controller>
  );
};

ECSelectField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,

  options: PropTypes.array,
  fname: PropTypes.func,
  fid: PropTypes.func,

  form: PropTypes.object,

  defaultValue: PropTypes.any,
  initial: PropTypes.object,
};
