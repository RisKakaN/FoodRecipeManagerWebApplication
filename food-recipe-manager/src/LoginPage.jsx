import React from 'react';

import { auth } from './Firebase.js';

import { Redirect } from "react-router-dom";

import './LoginPage.css';

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loginFailMessage: null
        };

        this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleLoginInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    login(e) {
        // start spinner
        e.preventDefault();
        auth.signInWithEmailAndPassword(
            this.state.email, this.state.password
        ).then(() => {
            // stop spinner
        }).catch((error) => {
            this.setState({ loginFailMessage: error.message });
        });
        // TODO: Start a loader. Some animating spinner, etc.
        // Then in the promise, check fail and handle it. E.g. stop the animating spinner and show "failed to login" label.
        // Use vars above...
        // If login is succeeded, it will be handled by parent's auth.onAuthStateChanged listener.
    }

    render() {
        console.log('Start to render LoginPage. isUserLoggedIn: ' + this.props.isUserLoggedIn);
        if (this.props.isUserLoggedIn) {
            console.log('User exists, render RecipesPage');
            return <Redirect to={'/recipes'} />;
        } else if (this.props.isUserLoggedIn === false) {
            console.log('User does not exist, render LoginPage');
            return (
                <div className="loginPage">
                    <form onSubmit={this.login}>
                        <input type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.email} />
                        <input type="password" name="password" placeholder="Password..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.password} />
                        <button>Login</button> {/* conditional spinner render */}
                    </form>
                    {this.state.loginFailMessage && this.state.loginFailMessage}
                </div>
            );
        } else {
            // Return empty screen while Firebase tries to authenticate.
            // This prevents showing the login page to appear for 1 sec, and then go to a logged in state (if user is logged in).
            // It makes it look like it is "loading".
            // TODO: Try to implement a better and smoother way without this "middle screen", while waiting for authentication.
            return <div></div>;
        }
    }
}