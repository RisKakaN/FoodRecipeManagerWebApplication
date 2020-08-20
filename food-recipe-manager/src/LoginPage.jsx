import React from 'react';
import { auth } from './Firebase.js';
import { Redirect, withRouter } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import './LoginPage.css';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            loginLoading: false,
            loginFailMessage: null
        };

        this.isComponentMounted = false;

        this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleRegistrationClick = this.handleRegistrationClick.bind(this);
        this.handleForgotPasswordClick = this.handleForgotPasswordClick.bind(this);
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutId);
        this.isComponentMounted = false;
    }

    handleLoginInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLoginClick(e) {
        e.preventDefault();
        // Start loading animation. Add small delay in case connection is too fast, which prevents a flickering experience.
        this.setState({ loginLoading: true, loginFailMessage: null });
        this.timeOutId = setTimeout(() => {
            auth.signInWithEmailAndPassword(
                this.state.email, this.state.password
            ).then(() => {
                if (this.isComponentMounted) {
                    this.setState({ loginLoading: false });
                }
            }).catch((error) => {
                if (this.isComponentMounted) {
                    this.setState({ loginLoading: false, loginFailMessage: error.message });
                }
            });
        }, 100);
    }

    handleForgotPasswordClick(e) {
        e.preventDefault();
        this.props.history.push("/reset-password");
    }

    handleRegistrationClick() {
        this.props.history.push("/registration");
    }

    render() {
        if (this.props.user) {
            return <Redirect to={'/recipes'} />;
        } else {
            return (
                <div className="loginPage">
                    <div className="loginPageTitle">Food Recipe Manager</div>
                    <div className="loginPageBox">
                        <form className="loginPageForm" onSubmit={this.handleLoginClick}>
                            <div className="loginPageEmailLabel">Email</div>
                            <input className="loginPageEmailInput" type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.email} required />
                            <div className="loginPagePasswordLabel">Password</div>
                            <input className="loginPagePasswordInput" type="password" name="password" placeholder="Password..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.password} required />
                            <div className="loginPageForgotPassword" onClick={this.handleForgotPasswordClick}>Forgot password?</div>
                            {!this.state.loginLoading ?
                                <button className="loginPageLoginButton">Login</button>
                                :
                                <div className="loginPageLoginLoader">
                                    <PulseLoader
                                        color={"#123abc"}
                                        loading={this.state.loginLoading}
                                    />
                                </div>}
                            {this.state.loginFailMessage &&
                                <div className="loginPageErrorMessage">
                                    {this.state.loginFailMessage}
                                </div>
                            }
                        </form>
                        <div className="loginPageRegister">
                            Are you new?
                            <div className="loginPageRegisterButton" onClick={this.handleRegistrationClick}>
                                Register here!
                            </div>
                        </div>
                    </div>
                    <div className="loginPageFooter">Developed by Martin So</div>
                </div>
            );
        }
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(LoginPage);