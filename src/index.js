import React from "react";
import ReactDOM from "react-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './auth';

const auth = new Auth();

const MeetupContext = React.createContext();
const UserContext = React.createContext();

const initialState = {
  user: {
    authenticated: false
  },
  meetup: {
    title: "React Edinburgh",
    date: Date()
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'cancelEvent':
      return {
        ...state,
        date: "cancelled"
      };
    case 'loginUser':
      return {
        ...state,
        authenticated: action.payload
      }
  }
};

function MeetupContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState.meetup);

  return (
    <MeetupContext.Provider
      value={{
        ...state,
        updateContext: () => dispatch({ type: "cancelEvent" })
      }}
    >
      {props.children}
    </MeetupContext.Provider>
  );
}

function UserContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState.user);

  (props.isRedirected) &&
    auth.handleAuthentication().then(() => {
        dispatch({ type: 'loginUser', payload: true })
    });

  return (
    <UserContext.Provider
      value={{
        ...state,
        login: auth.login
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

class App extends React.Component {
  constructor() {
    super()
    const urlParams = new URLSearchParams(window.location.search);
    this.isRedirected = urlParams.get('callback');
  }

  render() {
    return (
      <UserContextProvider isRedirected={this.isRedirected}>
          <MeetupContextProvider>
            <Content />
          </MeetupContextProvider>
      </UserContextProvider>
    );
  }
}

const Content = () => (
  <UserContext.Consumer>
    {user =>
        <MeetupContext.Consumer>
          {meetup => (
            <div className="card" style={{ margin: "20px" }}>
               <div class="card-body">
                  <h1 className="card-title">{meetup.title}</h1>
                  <h3 className="card-subtitle">{meetup.date}</h3>
                  <hr />
                  {user.authenticated
                    ? <button className="btn btn-primary" onClick={meetup.updateContext}>Cancel</button>
                    : <p>You need to <button className="btn btn-primary" onClick={user.login}>Login</button></p>
                  }
                </div>
            </div>
          )}
        </MeetupContext.Consumer>
    }
  </UserContext.Consumer>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
