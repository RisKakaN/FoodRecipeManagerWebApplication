import React from "react";
import { auth } from "./Firebase.js";
import { withRouter } from "react-router-dom";
import navigationBarLogo from "./assets/navigationBarLogo.png";
import "./NavigationBar.css";

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.handleHomeButtonClick = this.handleHomeButtonClick.bind(this);
        this.handleProfileClick = this.handleProfileClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleHomeButtonClick() {
        this.props.history.push("");
    }

    handleProfileClick() {
        this.props.history.push("/recipes/profile");
    }

    handleLogout() {
        auth.signOut()
            .then(() => {
                console.log("Signed out")
            });
    }

    render() {
        return (
            <div className="navigationBar">
                <div className="navigationBarHomeButton" onClick={this.handleHomeButtonClick}>
                    <img src={navigationBarLogo} alt="Logo" />
                    FoodRecipeManager
                </div>
                <div className="navigationBarRightButtons">
                    <div className="navigationBarProfileButton" onClick={this.handleProfileClick}>
                        {this.props.user.displayName}
                    </div>
                    <div className="navigationBarLogoutButton" onClick={this.handleLogout}>
                        Logout
                    </div>
                </div>
            </div>
        );
    }

}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(NavigationBar);