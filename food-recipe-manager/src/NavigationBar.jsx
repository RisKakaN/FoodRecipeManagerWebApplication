import React from "react";
import { auth } from "./Firebase.js";
import { withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import navigationBarLogo from "./assets/navigationBarLogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
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

            // !WARNING: Probably a react-bootstrap issue, which should be resolved in the future.
            // "Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. 
            // Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node"

            <Navbar className="navigationBar" collapseOnSelect expand="lg" variant="dark">
                <Navbar.Brand className="navigationBarHomeButton" onClick={this.handleHomeButtonClick}>
                    <img className="navigationBarHomeButtonImg" src={navigationBarLogo} alt="Logo" />
                    Food Recipe Manager
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link eventKey="1" onClick={this.handleHomeButtonClick} className="px-3" >Recipes</Nav.Link>
                        <Nav.Link href="" className="px-3">Shopping list</Nav.Link>
                        <Nav.Link href="" className="px-3">Recipe finder</Nav.Link>
                        {/* <NavDropdown title="TBD-Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="">TBD</NavDropdown.Item>
                            <NavDropdown.Item href="">TBD</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="">TBD</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Nav>
                        <Nav.Link eventKey="2" onClick={this.handleProfileClick} className="px-3"><div style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{this.props.user.displayName}</div></Nav.Link>
                        <Nav.Link onClick={this.handleLogout} className="px-3">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(NavigationBar);