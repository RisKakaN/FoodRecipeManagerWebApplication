import React from 'react';
import { auth } from './Firebase.js';
import { Redirect } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import './LoginPage.css';

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loginLoading: false,
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
        e.preventDefault();
        // Start loading animation. Add small delay in case connection is too fast, which prevents a flickering experience.
        this.setState({ loginLoading: true });
        setTimeout(() => {
            auth.signInWithEmailAndPassword(
                this.state.email, this.state.password
            ).then(() => {
                this.setState({ loginLoading: false });
            }).catch((error) => {
                this.setState({ loginLoading: false, loginFailMessage: error.message });
            });
        }, 500);
    }

    render() {
        if (this.props.isUserLoggedIn) {
            return <Redirect to={'/recipes'} />;
        } else if (this.props.isUserLoggedIn === false) {
            return (
                <div className="loginPage">
                    <form onSubmit={this.login}>
                        <input type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.email} />
                        <input type="password" name="password" placeholder="Password..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.password} />
                        <button>Login</button>
                    </form>
                    {this.state.loginLoading && <div className="loginPageLoginLoader">
                        <PulseLoader
                            size={10}
                            color={"#123abc"}
                            loading={this.state.loginLoading}
                        />
                    </div>}
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