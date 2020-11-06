import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import { convertErrors } from '../MeetupList/components/MeetupEditForm/MeetupEditForm';
import RegistrationCompleted from './components/RegistrationCompleted';

const schema = {
  accountName: {
    presence: { allowEmpty: true },
    length: {
      maximum: 32,
    },
  },
  userName: {
    presence: { allowEmpty: true },
    length: {
      maximum: 32,
    },
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64,
    },
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true,
  },
};

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  grid: {
    height: '100%',
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  logoImage: {
    marginLeft: theme.spacing(4),
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  title: {
    marginTop: theme.spacing(3),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  policyCheckbox: {
    marginLeft: '-14px',
  },
  signUpButton: {
    margin: theme.spacing(2, 0),
  },
}));

const Registration = props => {
  const appContext = useContext(AppContext);

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.values]);

  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (errors) {
      setFormState({
        ...formState,
        ...convertErrors(errors),
      });
    }
  }, [errors]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleRegister = event => {
    event.preventDefault();
    appContext.accountApi
      .registerAccount({
        displayName: 'Anatoly',
        description: 'user',
        email: 'efimo.tolik@gmail.com',
        password: '575410820u',
        forTest: true
      })
      .then(({ data }) => {
        setCompleted(true);
      })
      .catch(error => {
        const data = error.response.data;
        setErrors(data.errors || [data]);
      });
  };

  const hasError = field => (formState.touched[field] && formState.errors[field] ? true : false);

  if (!completed) {
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.contentHeader}></div>
          <div className={classes.contentBody}>
            <form className={classes.form} onSubmit={handleRegister}>
              <Typography className={classes.title} variant='h2'>
                Регистрация аккаунта
              </Typography>
              <TextField
                className={classes.textField}
                error={hasError('accountName')}
                fullWidth
                helperText={hasError('accountName') ? formState.errors.accountName : null}
                label='Название организации'
                name='accountName'
                onChange={handleChange}
                type='text'
                value={formState.values.accountName || ''}
                variant='outlined'
                required={true}
                autoComplete={'off'}
              />
              <TextField
                className={classes.textField}
                error={hasError('ownerEmail')}
                fullWidth
                helperText={hasError('ownerEmail') ? formState.errors.ownerEmail : null}
                label='E-mail'
                name='ownerEmail'
                onChange={handleChange}
                type='text'
                value={formState.values.ownerEmail || ''}
                variant='outlined'
                required={true}
                autoComplete={'off'}
              />
              <TextField
                className={classes.textField}
                error={hasError('ownerDisplayName')}
                fullWidth
                helperText={hasError('ownerDisplayName') ? formState.errors.ownerDisplayName : null}
                label='Имя пользователя'
                name='ownerDisplayName'
                onChange={handleChange}
                type='text'
                value={formState.values.ownerDisplayName || ''}
                variant='outlined'
                required={true}
                autoComplete={'off'}
              />
              <TextField
                className={classes.textField}
                error={hasError('ownerPassword')}
                fullWidth
                helperText={hasError('ownerPassword') ? formState.errors.ownerPassword : null}
                label='Пароль'
                name='ownerPassword'
                onChange={handleChange}
                type='password'
                value={formState.values.ownerPassword}
                variant='outlined'
                required={true}
                autoComplete='new-password'
              />
              <div className={classes.policy}>
                <Checkbox
                  checked={formState.values.policy || false}
                  className={classes.policyCheckbox}
                  color='primary'
                  name='policy'
                  onChange={handleChange}
                  required={true}
                />
                <Typography className={classes.policyText} color='textSecondary' variant='body1'>
                  Я соглашаюсь с&nbsp;
                  <Link
                    color='primary'
                    component={RouterLink}
                    to='/docs/terms-of-service.pdf'
                    underline='always'
                    variant='h6'
                    target={'_blank'}
                  >
                    Условиями использования продукта
                  </Link>
                  &nbsp;и принимаю&nbsp;
                  <Link
                    color='primary'
                    component={RouterLink}
                    to='/docs/privacy-policy.pdf'
                    underline='always'
                    variant='h6'
                    target={'_blank'}
                  >
                    Политику конфиденциальности
                  </Link>
                  .
                </Typography>
              </div>
              {hasError('policy') && <FormHelperText error>{formState.errors.policy[0]}</FormHelperText>}
              <Button
                className={classes.signUpButton}
                color='primary'
                fullWidth
                size='large'
                type='submit'
                variant='contained'
              >
                Зарегистрироваться
              </Button>
              <RouterLink to={'/sign-in'}>
                <Typography>Войти</Typography>
              </RouterLink>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return <RegistrationCompleted />;
  }
};

export default Registration;
