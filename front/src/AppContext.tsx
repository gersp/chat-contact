import React, { createContext } from 'react';
import axios, { AxiosInstance } from 'axios';
// import {
//   AccountApi,
//   AuthApi,
//   SessionInfoData,
//   ChannelsApi
// } from './api';
import { TopNoticeContextData } from './components/TopNotice/TopNoticeContext';

interface AppContextProps {
  apiUrl: string;
  history: any;
  topNotice: TopNoticeContextData;
}

interface Rastjazka {
  connectionError?: boolean;
  versionUpdated?: boolean;
  deskUpdated?: boolean;
}

export interface AppContextData {
  sessionId?: string;
  loading: boolean;
  // session?: SessionInfoData;
  // authApi: AuthApi;
  // accountApi: AccountApi;
  // channelsApi: ChannelsApi;
  axiosInstance: () => AxiosInstance;

  // login: (session: SessionInfoData) => void;
  logout: () => void;
  location: string;
  history: any;
  errorHandler: (error: any) => void;
}

interface AppContextState {
  // session?: SessionInfoData;
  loading: boolean;
}

const AppContext = createContext<AppContextData>({
  loading: false,
  // authApi: new AuthApi(),
  // channelsApi: new ChannelsApi(),
  // accountApi: new AccountApi(),
  axiosInstance: () => axios.create(),
  // login: () => {},
  logout: () => {},
  location: '/',
  history: {},
  errorHandler: () => {},
});

const getQueryVariable = (variable: string): string | undefined => {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return undefined;
};

class AppContextProvider extends React.Component<AppContextProps, AppContextState> {
  constructor(props: AppContextProps) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount(): void {
    console.log('AppContextProvider::mount');
    const sessionFromQuery = getQueryVariable('session');
    if (sessionFromQuery) {
      localStorage.setItem('sessionId', sessionFromQuery);
    }

    console.log(process.env.REACT_APP_EVENTOS_PROXY)

    // this.checkSessionInfo();
  }

  componentWillUnmount(): void {
    console.log('AppContextProvider::unmount');
  }


  // checkSessionInfo = () => {
  //   let sessionId = localStorage.getItem('sessionId') || undefined;
  //   console.log('checkSessionInfo ' + sessionId);
  //   if (!sessionId) {
  //     this.setState({
  //       session: undefined,
  //       loading: false,
  //     });
  //   } else {
  //     this.setState({
  //       loading: true,
  //     });
  //     console.log('Calling checkSession with sessionId=' + sessionId);
  //     const authApi = new AuthApi({ basePath: this.props.apiUrl, accessToken: sessionId });
  //     authApi
  //       .checkSession()
  //       .then(payload => {
  //         this.setState({
  //           session: payload.data,
  //           loading: false,
  //         });
  //       })
  //       .catch(() => {
  //         //localStorage.removeItem('sessionId');
  //         this.setState({
  //           session: undefined,
  //           loading: false,
  //         });
  //       });
  //   }
  // };

  errorHandler = (error: any) => {
    console.log('Default error handler');
    const { config, data } = error.response;
    if (config.url.endsWith('/check-session')) {
      return;
    }
    if (data.error === 'INVALID_ACCESS_TOKEN') {
      this.logout();
    }
    if (data.error === 'RESOURCE_NOT_FOUND') {
      this.props.history.replace('/not-found?request=' + config.url);
    }
    if (data.error === 'SESSION_EXPIRED') {
      this.props.topNotice.putMessage({ message: 'sessionExpired' });
    }
    if (data.error === 'INTERNAL_SERVER_ERROR') {
      let isTestHost = window.location.hostname === 'localhost' || window.location.hostname.startsWith('test');
      if (isTestHost) {
        alert(`${data.message}\nuuid: ${data.uuid}\nmessage: ${data.args.message}`);
      } else {
        alert(`${data.message} uuid: ${data.uuid}`);
      }
    }
    return Promise.reject(error);
  };

  axiosInstance = () => {
    const instance = axios.create();
    instance.interceptors.response.use(
      response => response,
      error => {
        return this.errorHandler(error);
      }
    );

    return instance;
  };

  // login = (session: SessionInfoData) => {
  //   localStorage.setItem('sessionId', session.sessionId!!);
  //   // this.props.ws.send({ register: session.sessionId });
  //   this.setState({
  //     session: session,
  //     loading: false,
  //   });
  //   // this.checkSessionInfo();
  // };

  logout = () => {
    // if (this.state.session) {
    //     const authApi = new AuthApi({ basePath: this.props.apiUrl, accessToken: this.state.session.sessionId });
    //     localStorage.removeItem('sessionId');
    //     this.setState({
    //       session: undefined,
    //       loading: false,
    //     });
    //     authApi.logout();
    //     this.props.history.push('/');
    // }
  
  };

  render() {
    // const sessionId = this.state.session != null ? this.state.session.sessionId : undefined;
    return (
      <AppContext.Provider
        value={{
          // sessionId: sessionId,
          loading: this.state.loading,
          location: window.location.href,
          // session: this.state.session,
          // authApi: new AuthApi(
          //   { basePath: this.props.apiUrl, accessToken: sessionId },
          //   this.props.apiUrl,
          //   this.axiosInstance()
          // ),
          // accountApi: new AccountApi(
          //   { basePath: this.props.apiUrl, accessToken: sessionId },
          //   this.props.apiUrl,
          //   this.axiosInstance()
          // ),
          // channelsApi: new ChannelsApi(
          //   { basePath: this.props.apiUrl, accessToken: sessionId },
          //   this.props.apiUrl,
          //   this.axiosInstance()
          // ),
          axiosInstance: this.axiosInstance,
          // login: this.login,
          logout: this.logout,
          history: this.props.history,
          errorHandler: this.errorHandler,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppContext, AppContextProvider };
