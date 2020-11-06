import React, { Component } from 'react';
import { Router, useParams } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import themeDefault from './theme/default';
import themePoly from './theme/polytech';
import themeEventos from './theme/eventos';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import { AppContext, AppContextProvider } from './AppContext';
import { Switch, Redirect } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

import NotFound from './views/NotFound/NotFound';
import SignIn from './views/SignIn/SignIn';
import Home from 'views/Home/Home';
import Registration from './views/Registration/Registration';
import RootRedirect from './views/RootRedirect/RootRedirect';
import Minimal from './layouts/Minimal/Minimal';
import Empty from 'layouts/Empty/Empty';
import Main from './layouts/Main/Main';
import moment from 'moment';
import 'moment/locale/ru';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import 'common/fonts.css';
import Favicon from 'react-favicon';
import { SnackbarProvider } from 'notistack';
import RouteWithLayout from './components/RouteWithLayout/RouteWithLayout';
import ym, { YMInitializer } from 'react-yandex-metrika';
import { TopNoticeContext, TopNoticeContextProvider } from './components/TopNotice/TopNoticeContext';
import { RestaurantRounded } from '@material-ui/icons';
import RegistrationConfirmed from './views/Registration/components/RegistrationConfirmed';
import ConfirmationFailed from './views/Registration/components/ConfirmationFailed';

const browserHistory = createBrowserHistory();

validate.validators = {
  ...validate.validators,
  ...validators,
};

const selectTheme = () => {
  if (window.location.hostname.indexOf('olyreg') !== -1) {
    return themePoly;
  }
  return themeEventos;
};

const isProduction = window.location.hostname === 'app.eventos42.ru';

export default class App extends Component {
  componentDidMount() {

    if (isProduction) {
      browserHistory.listen(location => {
        ym('hit', location.pathname);
      });
    } 

  }

  render() {
    moment.locale('ru');

    const arr = window.location.href.split('/');
    const url = arr[0] + '//' + arr[2];

    const theme = selectTheme();
    document.title = theme.documentTitle;
    return (
      <ThemeProvider theme={theme}>
        {isProduction && <YMInitializer accounts={[62529322]} options={{ webvisor: true }} version='2' />}
        <Favicon url={theme.topIcon} />

        <TopNoticeContextProvider>
          <TopNoticeContext.Consumer>
            {tn => (
              // Такой странный способ (topNotice={tn}) передачи зависимости я использую только потому, что не нашёл другого для класс-компонентов.
              // По идее, зависимости на нужные контексты должны быть упакованы внутри компонентов WSContextProvider и AppContextProvider,
              // а консьюмеров здесь быть не должно
              
                    <AppContextProvider apiUrl={url} history={browserHistory} topNotice={tn}>
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'ru'}>
                        <AppContext.Consumer>{({ loading }) => loading && <LoadingSpinner />}</AppContext.Consumer>
            
                        <SnackbarProvider>
                          <Router history={browserHistory}>
                            <Switch>
                              {/* <RouteWithLayout component={RootRedirect} layout={Empty} path='/' exact /> */}
                              <RouteWithLayout component={Home} layout={Empty} path='/' />
                              <RouteWithLayout component={SignIn} exact layout={Minimal} path='/sign-in' />
                              {theme.registrationAvailable && (
                                <>
                                  <RouteWithLayout
                                    component={Registration}
                                    exact
                                    layout={Minimal}
                                    path='/registration'
                                  />
                                  <RouteWithLayout
                                    component={RegistrationConfirmed}
                                    exact
                                    layout={Minimal}
                                    path='/registration-completed'
                                  />
                                  <RouteWithLayout
                                    component={ConfirmationFailed}
                                    exact
                                    layout={Minimal}
                                    path='/registration-failed'
                                  />
                                </>
                              )}
                           
                              {/*<RouteWithLayout*/}
                              {/*  component={TermsOfService}*/}
                              {/*  exact*/}
                              {/*  layout={Main}*/}
                              {/*  path="/terms-of-service"*/}
                              {/*/>*/}
                              {/*<RouteWithLayout*/}
                              {/*  component={PrivacyPolicy}*/}
                              {/*  exact*/}
                              {/*  layout={Main}*/}
                              {/*  path="/privacy-policy"*/}
                              {/*/>*/}
                              <RouteWithLayout component={NotFound} exact layout={Minimal} path='/not-found' />
                              <Redirect to='/not-found' />
                            </Switch>
                          </Router>
                        </SnackbarProvider>
                      </MuiPickersUtilsProvider>
                    </AppContextProvider>
            )}
          </TopNoticeContext.Consumer>
        </TopNoticeContextProvider>
      </ThemeProvider>
    );
  }
}
