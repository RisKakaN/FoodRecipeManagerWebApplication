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

        this.isComponentMounted = false;

        this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
        this.login = this.login.bind(this);
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

    login(e) {
        e.preventDefault();
        // Start loading animation. Add small delay in case connection is too fast, which prevents a flickering experience.
        this.setState({ loginLoading: true });
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
        }, 300);
    }

    render() {
        if (this.props.user) {
            return <Redirect to={'/recipes'} />;
        } else {
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
        }
    }
}