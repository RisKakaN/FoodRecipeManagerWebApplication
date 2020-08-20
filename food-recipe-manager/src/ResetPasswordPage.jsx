import React from 'react';
import { auth } from './Firebase.js';
import { withRouter } from 'react-router-dom';
import PulseLoader from "react-spinners/PulseLoader";
import './ResetPasswordPage.css';

class ResetPasswordPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            resetLoading: false,
            resetFailMessage: null,
            resetDone: false,
        };

        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.handleReturnClick = this.handleReturnClick.bind(this);
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutId);
        this.isComponentMounted = false;
    }

    handleEmailInputChange(e) {
        this.setState({ email: e.target.value })
    }

    handleResetClick(e) {
        e.preventDefault();
        this.setState({
            resetLoading: true,
            resetFailMessage: null
        });
        this.timeOutId = setTimeout(() => {
            auth.sendPasswordResetEmail(this.state.email).then(() => {
                this.setState({
                    resetLoading: true,
                    resetFailMessage: null,
                    resetDone: true
                });
            }).catch((error) => {
                this.setState({
                    resetLoading: false,
                    resetFailMessage: error.message
                });
            });
        }, 300);
    }

    handleReturnClick() {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="resetPasswordPage">
                {this.state.resetDone ?
                    <div className="resetPasswordPageBox">
                        <div className="resetPasswordPageBoxHeader">Reset done!</div>
                        <div className="resetPasswordPageBoxInfo">Please check your email.</div>
                        <button className="resetPasswordPageBoxButton" onClick={this.handleReturnClick}>Go back to Login</button>
                    </div>
                    :
                    <form className="resetPasswordPageBox" onSubmit={this.handleResetClick}>
                        <div className="resetPasswordPageBoxHeader">Reset password</div>
                        <div className="resetPasswordPageBoxInfo">Please enter your email and proceed. Then follow the directions that will be sent to your email.</div>
                        <input className="resetPasswordPageEmailInput" type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleEmailInputChange} value={this.state.email} required />
                        {!this.state.resetLoading ?
                            <button className="resetPasswordPageBoxButton">Reset</button>
                            :
                            <div className="resetPasswordPageResetLoader">
                                <PulseLoader
                                    color={"#123abc"}
                                    loading={this.state.resetLoading}
                                />
                            </div>}
                        {this.state.resetFailMessage && <div className="resetPasswordPageErrorMessage">{this.state.resetFailMessage}</div>}
                    </form>
                }
            </div>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(ResetPasswordPage);