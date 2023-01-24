import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { CountryDetailProvider } from "./Contexts/countryDetailContext";
import { ErrorBoundary } from "./Pages/ErrorBoundary/ErrroBoundary";
import { UserDetailProvider } from "./Contexts/userContext";
import { UserPermissionsProvider } from "./Contexts/userPermissionsContext";
import { store } from "./Store/store";
ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <CountryDetailProvider>
        <UserDetailProvider>
          <UserPermissionsProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </UserPermissionsProvider>
        </UserDetailProvider>
      </CountryDetailProvider>
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
