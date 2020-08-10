import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { auth } from './Firebase.js';
import LoginPage from './LoginPage.jsx'
import NavigationBar from './NavigationBar.jsx'
import RecipesPage from './RecipesPage.jsx'
import RecipeDetailsPage from './RecipeDetailsPage.jsx'
import AddRecipePage from './AddRecipePage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    // Make use of localStorage to store current user's session, until the user manually logout.
    this.state = {
      user: JSON.parse(localStorage.getItem('authenticatedUser')),
    };
  }

  componentDidMount() {
    // Listener: Check whether a user is logged in.
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('authenticatedUser', JSON.stringify(user));
        this.setState({ user: user });
      } else {
        localStorage.removeItem('authenticatedUser');
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={(props) => <LoginPage user={this.state.user} {...props} />} />
            {/* Add other non-user authenticated page routes here. */}

            <RequireAuth path="/recipes" user={this.state.user}>
              <Route
                path="/recipes"
                render={({ match: { path } }) => (
                  <>
                    <div className="appNavigationBar">
                      <NavigationBar user={this.state.user} />
                    </div>
                    <Route exact path={`${path}/`} render={(props) => <RecipesPage user={this.state.user} {...props} />} />
                    <Route exact path={`${path}/add`} render={(props) => <AddRecipePage user={this.state.user} {...props} />} />
                    <Route exact path={`${path}/details/:recipeRouteName`} render={(props) => <RecipeDetailsPage user={this.state.user} {...props} />} />
                    {/* Only user authenticated page routes here, which are in /recipes. */}
                  </>
                )}
              />
            </RequireAuth>

            <Route exact path="/404" component={NotFoundPage} />
            <Redirect to={'/404'} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

// Route wrapper for making sure that a user is authenticated before redirecting to user specific content.
const RequireAuth = ({ user, children }) => {
  if (user) {
    return children;
  }
  return <Redirect to={'/'} />;
};