import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField, Typography, useTheme } from '@material-ui/core';
import { AppContext } from '../../AppContext';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64,
    },
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128,
    },
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  grid: {
    height: '100%',
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
  socialButtons: {
    marginTop: theme.spacing(3),
  },
  socialIcon: {
    marginRight: theme.spacing(1),
  },
  sugestion: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  signInButton: {
    margin: theme.spacing(2, 0),
  },
}));

const SignIn = () => {
  const theme = useTheme();
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: true,
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
  }, [formState.values]);

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

  const appContext = useContext(AppContext);

  const handleSignIn = event => {
    event.preventDefault();
    appContext.authApi
      .login({
        login: 'efimo.tolik@gmail.com',
        password: '575410820u',
      })
      .then(payload => {
        appContext.login(payload.data);
        appContext.history.push('/');
      })
      .catch(error => {
        const data = error.response.data;
        setFormState(formState => ({
          ...formState,
          errors: {
            email: [data.message],
            password: [data.message],
          },
        }));
      });
  };

  const hasError = field => (formState.touched[field] && formState.errors[field] ? true : false);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.contentBody}>
          <form className={classes.form} onSubmit={handleSignIn}>
            <Typography className={classes.title} variant='h2'>
              Вход администратора
            </Typography>
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              label='Адрес электронной почты'
              name='email'
              onChange={handleChange}
              type='text'
              value={formState.values.email || ''}
              variant='outlined'
            />
            <TextField
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={hasError('password') ? formState.errors.password[0] : null}
              label='Пароль'
              name='password'
              onChange={handleChange}
              type='password'
              value={formState.values.password || ''}
              variant='outlined'
            />
            <Button
              className={classes.signInButton}
              color='primary'
              fullWidth
              size='large'
              type='submit'
              variant='contained'
            >
              Войти
            </Button>
            {theme.registrationAvailable && (
              <RouterLink to={'/registration'}>
                <Typography>Регистрация аккаунта</Typography>
              </RouterLink>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object,
};

export default SignIn;
