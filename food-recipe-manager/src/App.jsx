import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { auth } from "./Firebase.js";
import LoginPage from "./LoginPage.jsx"
import RegistrationPage from "./RegistrationPage.jsx"
import RegistrationCompletePage from "./RegistrationCompletePage.jsx"
import ResetPasswordPage from "./ResetPasswordPage.jsx"
import NavigationBar from "./NavigationBar.jsx"
import RecipesPage from "./RecipesPage.jsx"
import RecipeDetailsPage from "./RecipeDetailsPage.jsx"
import AddRecipePage from "./AddRecipePage.jsx"
import ShoppingListPage from "./ShoppingListPage.jsx"
import RecipeFinderPage from "./RecipeFinderPage.jsx"
import ProfilePage from "./ProfilePage.jsx"
import GoodByePage from "./GoodByePage.jsx"
import NotFoundPage from "./NotFoundPage.jsx"
import "./App.css";

export default class App extends React.Component {

  constructor(props) {
    super(props);

    // Make use of localStorage to store current user's session, until the user manually logout.
    this.state = {
      user: JSON.parse(localStorage.getItem("authenticatedUser")),
    };
  }

  componentDidMount() {
    // Listener: Check whether a user is logged in.
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("authenticatedUser", JSON.stringify(user));
        this.setState({ user: user });
      } else {
        localStorage.removeItem("authenticatedUser");
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
            <Route exact path="/registration" render={(props) => <RegistrationPage user={this.state.user} {...props} />} />
            <Route exact path="/registration-complete" render={(props) => <RegistrationCompletePage user={this.state.user} {...props} />} />
            <Route exact path="/reset-password" render={(props) => <ResetPasswordPage user={this.state.user} {...props} />} />

            {/* Add other non-user authenticated page routes here. */}

            <RequireAuth path="/user" user={this.state.user}>
              <div className="appNavigationBar">
                <NavigationBar user={this.state.user} />
              </div>
              <Route path="/user" render={({ match: { path } }) => (
                <>
                  <Route exact path={`${path}/`} render={(props) => <RecipesPage user={this.state.user} {...props} />} />
                  <Route exact path={`${path}/recipes`} render={(props) => <RecipesPage user={this.state.user} {...props} />} />
                  <Route exact path={`${path}/recipes/add`} render={(props) => <AddRecipePage user={this.state.user} {...props} />} />
                  <Route exact path={`${path}/recipes/details/:recipeRouteName`} render={(props) => <RecipeDetailsPage user={this.state.user} {...props} />} />
                  <Route exact path={`${path}/shopping-list`} render={(props) => <ShoppingListPage user={this.state.user} {...props} />} />
                  <Route exact path={`${path}/recipe-finder`} render={(props) => <RecipeFinderPage user={this.state.user} {...props} />} />
                  <Route exact path={`${path}/profile`} render={(props) => <ProfilePage user={this.state.user} {...props} />} />
                  {/* Only user authenticated page routes here, which are in /user. */}

                </>
              )}
              />
            </RequireAuth>

            <Route exact path="/good-bye" component={GoodByePage} />

            <Route exact path="/404" component={NotFoundPage} />
            <Redirect to={"/404"} />
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
  return <Redirect to={"/"} />;
};