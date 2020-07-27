import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { auth } from './Firebase.js';
import LoginPage from './LoginPage.jsx'
import RecipesPage from './RecipesPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: null,
      user: null,
    };
  }

  componentDidMount() {
    // Listener: Check whether a user is logged in.
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isUserLoggedIn: true, user: user });
      } else {
        this.setState({ isUserLoggedIn: false });
      }
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <LoginPage isUserLoggedIn={this.state.isUserLoggedIn} {...props} />} />
          <RequireAuth exact path="/recipes" isUserLoggedIn={this.state.isUserLoggedIn}>
            <Route exact path="/recipes" render={(props) => <RecipesPage user={this.state.user} {...props} />} />
          </RequireAuth>
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect to={'/404'} />
        </Switch>
      </BrowserRouter>
    );
  }
}

// Route wrapper for making sure that a user is authenticated before redirecting to /recipes.
const RequireAuth = ({ isUserLoggedIn, children }) => {
  if (isUserLoggedIn) {
    return children;
  }
  return <Redirect to={'/'} />;
};