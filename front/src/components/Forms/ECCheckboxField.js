import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Controller } from 'react-hook-form';
import { valueByName } from './form_utils';

export const ECCheckboxField = props => {
  const { name, label, form, defaultValue, initial, ...rest } = props;

  const dv = defaultValue || (initial && valueByName(initial, name)) || false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => form.setValue(name, dv), []);

  return (
    <FormControlLabel
      labelPlacement={'start'}
      control={
        <Controller
          as={Checkbox}
          control={form.control}
          name={name}
          defaultValue={dv}
          inputProps={{
            'aria-label': 'primary checkbox',
          }}
          {...rest}
        />
      }
      label={label}
    />
  );
};

ECCheckboxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  form: PropTypes.object,
  defaultValue: PropTypes.any,
  initial: PropTypes.object,
};
