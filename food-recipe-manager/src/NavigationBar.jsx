import React from "react";
import { auth } from "./Firebase.js";
import { withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import navigationBarLogo from "./assets/navigationBarLogo.png";
import profilePhotoPlaceholder from "./assets/profilePhotoPlaceholder.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavigationBar.css";

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.handleNavigationClick = this.handleNavigationClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.getNavigationPathEvenKey = this.getNavigationPathEvenKey.bind(this);
    }

    handleLogout() {
        auth.signOut()
            .then(() => {
                console.log("Signed out")
            });
    }

    handleNavigationClick(path) {
        this.props.history.push(path);
    }

    getNavigationPathEvenKey() {
        if (this.props.location.pathname.includes("/user/recipes")) {
            return "recipes";
        } else if (this.props.location.pathname.includes("/user/shopping-list")) {
            return "shopping-list";
        } else if (this.props.location.pathname.includes("/user/recipe-finder")) {
            return "recipe-finder";
        } else if (this.props.location.pathname.includes("/user/profile")) {
            return "profile";
        } else {
            return "";
        }
    }

    render() {
        return (
            // !WARNING: Probably a react-bootstrap issue, which should be resolved in the future.
            // "Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. 
            // Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node"

            <Navbar className="navigationBar" collapseOnSelect expand="lg" variant="dark">
                <Navbar.Brand className="navigationBarHomeButton" onClick={() => this.handleNavigationClick("")}>
                    <img className="navigationBarHomeButtonImg" src={navigationBarLogo} alt="Logo" />
                    Food Recipe Manager
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto" activeKey={this.getNavigationPathEvenKey()}>
                        <Nav.Link eventKey="recipes" onClick={() => this.handleNavigationClick("/user")} className="px-3 navigationBarLink" >Recipes</Nav.Link>
                        <Nav.Link eventKey="shopping-list" onClick={() => this.handleNavigationClick("/user/shopping-list")} className="px-3 navigationBarLink">Shopping list</Nav.Link>
                        <Nav.Link eventKey="recipe-finder" onClick={() => this.handleNavigationClick("/user/recipe-finder")} className="px-3 navigationBarLink">Recipe finder</Nav.Link>
                    </Nav>
                    <Nav activeKey={this.getNavigationPathEvenKey()}>
                        <Nav.Link eventKey="profile" onClick={() => this.handleNavigationClick("/user/profile")} className="px-3 navigationBarLink">
                            <div className="navigationBarProfile">
                                <div className="navigationBarProfilePhotoHolder">
                                    {this.props.profilePhoto ?
                                        <div className="navigationBarProfilePhoto"><img src={this.props.profilePhoto} alt="Click to change"></img></div>
                                        :
                                        <img className="navigationBarProfilePagePhotoPlaceholderImage" src={profilePhotoPlaceholder} alt="Click to add" ></img>
                                    }
                                </div>
                                <div className="navigationBarProfileName">
                                    {this.props.profileName}
                                </div>
                            </div>
                        </Nav.Link>
                        <Nav.Link onClick={this.handleLogout} className="px-3 navigationBarLink">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(NavigationBar);