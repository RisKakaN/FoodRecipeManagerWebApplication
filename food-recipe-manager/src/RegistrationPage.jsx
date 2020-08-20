import React from 'react';
import { auth } from './Firebase.js';
import { Redirect, withRouter } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import './RegistrationPage.css';

class RegistrationPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            displayName: "",
            registrationLoading: false,
            registrationFailMessage: null
        };

        this.handleRegistrationInputChange = this.handleRegistrationInputChange.bind(this);
        this.handleRegistrationClick = this.handleRegistrationClick.bind(this);
        this.handleReturnClick = this.handleReturnClick.bind(this);
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutId);
        this.isComponentMounted = false;
    }

    handleRegistrationInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRegistrationClick(e) {
        e.preventDefault();
        this.setState({ registrationLoading: true, registrationFailMessage: null });
        this.timeOutId = setTimeout(() => {
            auth.createUserWithEmailAndPassword(
                this.state.email, this.state.password
            ).then(() => {
                if (this.isComponentMounted) {
                    // Send email verification to the user:
                    auth.currentUser.sendEmailVerification();
                    // Set user's display name:
                    auth.currentUser.updateProfile({
                        displayName: this.state.displayName
                    }).then(() => {
                        // Manually sign out since Firebase keeps you signed in by default after signing up.
                        // Reason for signing out is to let the user sign in themselves for the first time.
                        auth.signOut().then(() => {
                            this.props.history.push(
                                "/registration-complete",
                                { registrationComplete: true }
                            );
                        });
                    }).catch(() => {
                        auth.signOut().then(() => {
                            this.props.history.push(
                                "/registration-complete",
                                { registrationComplete: true }
                            );
                        });
                    });
                }
            }).catch((error) => {
                if (this.isComponentMounted) {
                    this.setState({ registrationLoading: false, registrationFailMessage: error.message });
                }
            });
        }, 300);
    }

    handleReturnClick(e) {
        e.preventDefault();
        this.props.history.push("/");
    }

    render() {
        if (this.props.user && !this.state.registrationLoading) {
            return <Redirect to={'/recipes'} />;
        } else {
            return (
                <div className="registrationPage">
                    <div className="registrationPageTitle">Create your account</div>
                    <div className="registrationPageBox">
                        <form className="registrationPageForm" onSubmit={this.handleRegistrationClick}>
                            <div className="registrationPageDisplayNameLabel">Name</div>
                            <input className="registrationPageDisplayNameInput" type="text" name="displayName" placeholder="Name..." autoComplete="on" onChange={this.handleRegistrationInputChange} value={this.state.displayName} minLength="1" maxLength="15" required />
                            <div className="registrationPageEmailLabel">Email</div>
                            <input className="registrationPageEmailInput" type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleRegistrationInputChange} value={this.state.email} required />
                            <div className="registrationPagePasswordLabel">Password</div>
                            <input className="registrationPagePasswordInput" type="password" name="password" placeholder="Password..." autoComplete="on" onChange={this.handleRegistrationInputChange} value={this.state.password} minLength="6" required />
                            {!this.state.registrationLoading ?
                                <button className="registrationPageRegisterButton">Register</button>
                                :
                                <div className="registrationPageRegistrationLoader">
                                    <PulseLoader
                                        color={"#123abc"}
                                        loading={this.state.registrationLoading}
                                    />
                                </div>}
                            {this.state.registrationFailMessage &&
                                <div className="registrationPageErrorMessage">
                                    {this.state.registrationFailMessage}
                                </div>
                            }
                        </form>
                        <div className="registrationPageAlreadyRegistered">
                            Already registered?
                        <div className="registrationPageAlreadyRegisteredButton" onClick={this.handleReturnClick}>
                                Login now!
                        </div>
                        </div>
                    </div>
                    <div className="registrationPageFooter">Developed by Martin So</div>
                </div>
            );
        }
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RegistrationPage);