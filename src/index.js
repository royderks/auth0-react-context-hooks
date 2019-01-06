import React from "react";
import ReactDOM from "react-dom";

const MeetupContext = React.createContext();

const initialState = {
  title: "React Edinburgh",
  date: Date()
};

const reducer = (state, action) => {
  switch (action.type) {
    case "cancelEvent":
      return {
        ...initialState,
        date: "cancelled"
      };
  }
};

function MeetupContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

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

class App extends React.Component {
  render() {
    return (
      <MeetupContextProvider>
        <Content />
      </MeetupContextProvider>
    );
  }
}

const Content = () => (
  <MeetupContext.Consumer>
    {value => (
      <div>
        <h1>{value.title}</h1>
        <h3>{value.date}</h3>
        <button onClick={value.updateContext}>Cancel</button>
      </div>
    )}
  </MeetupContext.Consumer>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
