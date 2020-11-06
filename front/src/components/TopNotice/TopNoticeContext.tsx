import React, { createContext } from 'react';
import TopNotice from './TopNotice';

interface TopNoticeContextProps {}

export interface TopNoticeMessage {
  message?: 'connectionError' | 'deskUpdated' | 'sessionExpired';
  text?: string;
  level?: 'warn' | 'error';
  persistent?: boolean;
  removable?: boolean;
}

export interface TopNoticeContextData {
  messages: TopNoticeMessage[];

  putMessage: (message: TopNoticeMessage) => void;
  removeMessage: (message?: string) => void;
}

interface TopNoticeContextState {
  messages: TopNoticeMessage[];
}

const TopNoticeContext = createContext<TopNoticeContextData>({
  messages: [],
  putMessage: () => {},
  removeMessage: () => {},
});

class TopNoticeContextProvider extends React.Component<TopNoticeContextProps, TopNoticeContextState> {
  constructor(props: TopNoticeContextProps) {
    super(props);
    this.state = {
      messages: this.loadPersistentNotice(),
    };
  }

  loadPersistentNotice = () => {
    // load messages from localStorage
    return [];
  };

  putMessage = (message: TopNoticeMessage) => {
    console.log('TopNoticeContextProvider::putMessage ' + JSON.stringify(message));
    this.setState({ messages: this.state.messages.concat(message) });
  };

  removeMessage = (message?: string) => {
    console.log('TopNoticeContextProvider::removeMessage ' + JSON.stringify(message));
    if (!message) {
      this.setState({ messages: this.state.messages.slice(1, this.state.messages.length) });
    } else {
      this.setState({ messages: this.state.messages.filter(m => m.message !== message) });
    }
  };

  render() {
    console.log('TopNoticeContextProvider::render ' + JSON.stringify(this.state.messages));
    return (
      <>
        {this.state.messages.length > 0 && <TopNotice {...this.state.messages[0]} onRemove={this.removeMessage} />}
        <TopNoticeContext.Provider
          value={{
            messages: this.state.messages,
            putMessage: this.putMessage,
            removeMessage: this.removeMessage,
          }}
        >
          {this.props.children}
        </TopNoticeContext.Provider>
      </>
    );
  }
}

export { TopNoticeContext, TopNoticeContextProvider };
