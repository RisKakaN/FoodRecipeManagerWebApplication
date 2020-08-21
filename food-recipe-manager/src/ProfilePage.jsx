import React from 'react';
import Firebase, { auth } from './Firebase.js';
import { withRouter } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import './ProfilePage.css';

class ProfilePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayName: "",
            displayNameEditModeActive: false,
            displayNameEditLoading: false,
            displayNameEditError: null,

            email: "",
            emailEditModeActive: false,
            emailEditLoading: false,
            emailEditError: null,

            password: "",
            passwordEditModeActive: false,
            passwordEditLoading: false,
            passwordEditError: null,

            deleteAccountModeActive: false,
            deleteAccountLoading: false,
            deleteAccountError: null,

            reAuthenticationEmail: "",
            reAuthenticationPassword: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);

        this.handleEditDisplayName = this.handleEditDisplayName.bind(this);
        this.handleSaveDisplayName = this.handleSaveDisplayName.bind(this);
        this.handleCancelDisplayName = this.handleCancelDisplayName.bind(this);

        this.handleEditEmail = this.handleEditEmail.bind(this);
        this.handleSaveEmail = this.handleSaveEmail.bind(this);
        this.handleCancelEmail = this.handleCancelEmail.bind(this);

        this.handleEditPassword = this.handleEditPassword.bind(this);
        this.handleSavePassword = this.handleSavePassword.bind(this);
        this.handleCancelPassword = this.handleCancelPassword.bind(this);

        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
        this.handleConfirmDeleteAccount = this.handleConfirmDeleteAccount.bind(this);
        this.handleCancelDeleteAccount = this.handleCancelDeleteAccount.bind(this);
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutDisplayName);
        clearTimeout(this.timeOutEmail);
        clearTimeout(this.timeOutPassword);
        clearTimeout(this.timeOutDeleteAccount);
        this.isComponentMounted = false;
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // ============================== Display name ==============================
    handleEditDisplayName(e) {
        e.preventDefault();
        this.setState({
            displayName: auth.currentUser.displayName,
            displayNameEditModeActive: true,
            displayNameEditLoading: false,
            displayNameEditError: null
        });
    }

    handleSaveDisplayName(e) {
        e.preventDefault();
        this.setState({
            displayNameEditLoading: true,
            displayNameEditError: null
        });

        this.timeOutDisplayName = setTimeout(() => {
            auth.currentUser.updateProfile({
                displayName: this.state.displayName,
            }).then(() => {
                if (this.isComponentMounted) {
                    this.setState({
                        displayNameEditModeActive: false,
                        displayNameEditLoading: false,
                        displayNameEditError: null
                    });
                }
            }).catch((error) => {
                if (this.isComponentMounted) {
                    this.setState({
                        displayNameEditModeActive: true,
                        displayNameEditLoading: false,
                        displayNameEditError: error.message
                    });
                }
            });
        }, 300);
    }

    handleCancelDisplayName(e) {
        e.preventDefault();
        this.setState({
            displayNameEditModeActive: false,
            displayNameEditLoading: false,
            displayNameEditError: null
        });
    }

    // ============================== Email ==============================
    handleEditEmail(e) {
        e.preventDefault();
        this.setState({
            reAuthenticationEmail: "",
            reAuthenticationPassword: "",
            emailEditModeActive: true,
            emailEditLoading: false,
            emailEditError: null
        });
    }

    handleSaveEmail(e) {
        e.preventDefault();
        this.setState({
            emailEditLoading: true,
            emailEditError: null
        });

        this.timeOutEmail = setTimeout(() => {
            const user = auth.currentUser;
            const credential = Firebase.auth.EmailAuthProvider.credential(
                this.state.reAuthenticationEmail,
                this.state.reAuthenticationPassword
            );
            user.reauthenticateWithCredential(credential).then(() => {
                user.updateEmail(this.state.email).then(() => {
                    this.setState({
                        emailEditModeActive: false,
                        emailEditLoading: false,
                        emailEditError: null
                    });
                }).catch((error) => {
                    this.setState({
                        emailEditModeActive: true,
                        emailEditLoading: false,
                        emailEditError: error.message
                    });
                });
            }).catch((error) => {
                this.setState({
                    emailEditModeActive: true,
                    emailEditLoading: false,
                    emailEditError: error.message
                });
            });
        }, 300);
    }

    handleCancelEmail(e) {
        e.preventDefault();
        this.setState({
            emailEditModeActive: false,
            emailEditLoading: false,
            emailEditError: null
        });
    }

    // ============================== Password ==============================
    handleEditPassword(e) {
        e.preventDefault();
        this.setState({
            reAuthenticationEmail: "",
            reAuthenticationPassword: "",
            passwordEditModeActive: true,
            passwordEditLoading: false,
            passwordEditError: null
        });
    }

    handleSavePassword(e) {
        e.preventDefault();
        this.setState({
            passwordEditLoading: true,
            passwordEditError: null
        });

        this.timeOutPassword = setTimeout(() => {
            const user = auth.currentUser;
            const credential = Firebase.auth.EmailAuthProvider.credential(
                this.state.reAuthenticationEmail,
                this.state.reAuthenticationPassword
            );
            user.reauthenticateWithCredential(credential).then(() => {
                user.updatePassword(this.state.password).then(() => {
                    this.setState({
                        passwordEditModeActive: false,
                        passwordEditLoading: false,
                        passwordEditError: null
                    });
                }).catch((error) => {
                    this.setState({
                        passwordEditModeActive: true,
                        passwordEditLoading: false,
                        passwordEditError: error.message
                    });
                });
            }).catch((error) => {
                this.setState({
                    passwordEditModeActive: true,
                    passwordEditLoading: false,
                    passwordEditError: error.message
                });
            });
        }, 300);
    }

    handleCancelPassword(e) {
        e.preventDefault();
        this.setState({
            passwordEditModeActive: false,
            passwordEditLoading: false,
            passwordEditError: null
        });
    }

    // ============================== Account deletion ==============================
    handleDeleteAccount(e) {
        e.preventDefault();
        this.setState({
            reAuthenticationEmail: "",
            reAuthenticationPassword: "",
            deleteAccountModeActive: true,
            deleteAccountLoading: false,
            deleteAccountError: null
        });
    }

    handleConfirmDeleteAccount(e) {
        e.preventDefault();
        this.setState({
            deleteAccountLoading: true,
            deleteAccountError: null
        });
        this.timeOutDeleteAccount = setTimeout(() => {
            const user = auth.currentUser;
            const credential = Firebase.auth.EmailAuthProvider.credential(
                this.state.reAuthenticationEmail,
                this.state.reAuthenticationPassword
            );
            user.reauthenticateWithCredential(credential).then(() => {
                user.delete().then(() => {
                    this.props.history.push(
                        "/good-bye",
                        { accountDeletionComplete: true }
                    );
                }).catch((error) => {
                    this.setState({
                        deleteAccountModeActive: true,
                        deleteAccountLoading: false,
                        deleteAccountError: error.message
                    });
                });
            }).catch((error) => {
                this.setState({
                    deleteAccountModeActive: true,
                    deleteAccountLoading: false,
                    deleteAccountError: error.message
                });
            });
        }, 300);
    }

    handleCancelDeleteAccount(e) {
        e.preventDefault();
        this.setState({
            deleteAccountModeActive: false,
            deleteAccountLoading: false,
            deleteAccountError: null
        });
    }

    render() {
        const user = auth.currentUser;
        if (user) {
            return (
                <div className="profilePage">
                    <div className="profilePageTitle">Profile</div>

                    {/* ============================== Name ============================== */}
                    <div className="profilePageBox">
                        <form className="profilePageForm" onSubmit={this.handleSaveDisplayName}>
                            <div className="profilePageFormPropertyLabel">Name</div>
                            {!this.state.displayNameEditModeActive ?
                                <>
                                    <div className="profilePageFormProperty">{user.displayName}</div>
                                    <div className="profilePageFormPropertyButtonHolder">
                                        <button className="profilePageFormPropertyButton" onClick={this.handleEditDisplayName}>Edit</button>
                                    </div>
                                </>
                                :
                                <>
                                    <input className="profilePageFormPropertyInput" type="text" name="displayName" placeholder="Name..." onChange={this.handleInputChange} value={this.state.displayName} minLength="1" maxLength="15" autoComplete="off" required />
                                    <div className="profilePageFormPropertyErrorLabel">
                                        {this.state.displayNameEditError}
                                    </div>
                                    {this.state.displayNameEditLoading ?
                                        <div className="profilePageLoader">
                                            <PulseLoader
                                                color={"#123abc"}
                                                loading={this.state.displayNameEditLoading}
                                            />
                                        </div>
                                        :
                                        <div className="profilePageFormPropertyButtonHolder">
                                            <button className="profilePageFormPropertyButton">Save</button>
                                            <button className="profilePageFormPropertyButton" onClick={this.handleCancelDisplayName}>Cancel</button>
                                        </div>
                                    }
                                </>
                            }
                        </form>
                    </div>

                    {/* ============================== Email ============================== */}
                    <div className="profilePageBox">
                        <form className="profilePageForm" onSubmit={this.handleSaveEmail}>
                            <div className="profilePageFormPropertyLabel">Email</div>
                            {!this.state.emailEditModeActive ?
                                <>
                                    <div className="profilePageFormProperty">{user.email}</div>
                                    <div className="profilePageFormPropertyButtonHolder">
                                        <button className="profilePageFormPropertyButton" onClick={this.handleEditEmail}>Edit</button>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="profilePageFormPropertyLabel">Current email</div>
                                    <input className="profilePageFormPropertyInput" type="email" name="reAuthenticationEmail" placeholder="Email..." onChange={this.handleInputChange} value={this.state.reAuthenticationEmail} autoComplete="off" required />
                                    <div className="profilePageFormPropertyLabel">Current password</div>
                                    <input className="profilePageFormPropertyInput" type="password" name="reAuthenticationPassword" placeholder="Password..." onChange={this.handleInputChange} value={this.state.reAuthenticationPassword} minLength="6" autoComplete="off" required />
                                    <div className="profilePageFormPropertyLabel">New email</div>
                                    <input className="profilePageFormPropertyInput" type="email" name="email" placeholder="Email..." onChange={this.handleInputChange} value={this.state.email} autoComplete="off" required />
                                    <div className="profilePageFormPropertyErrorLabel">
                                        {this.state.emailEditError}
                                    </div>
                                    {this.state.emailEditLoading ?
                                        <div className="profilePageLoader">
                                            <PulseLoader
                                                color={"#123abc"}
                                                loading={this.state.emailEditLoading}
                                            />
                                        </div>
                                        :
                                        <div className="profilePageFormPropertyButtonHolder">
                                            <button className="profilePageFormPropertyButton">Save</button>
                                            <button className="profilePageFormPropertyButton" onClick={this.handleCancelEmail}>Cancel</button>
                                        </div>
                                    }
                                </>
                            }
                        </form>
                    </div>

                    {/* ============================== Password ============================== */}
                    <div className="profilePageBox">
                        <form className="profilePageForm" onSubmit={this.handleSavePassword}>
                            <div className="profilePageFormPropertyLabel">Password</div>
                            {!this.state.passwordEditModeActive ?
                                <>
                                    <div className="profilePageFormProperty">******</div>
                                    <div className="profilePageFormPropertyButtonHolder">
                                        <button className="profilePageFormPropertyButton" onClick={this.handleEditPassword}>Edit</button>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="profilePageFormPropertyLabel">Current email</div>
                                    <input className="profilePageFormPropertyInput" type="email" name="reAuthenticationEmail" placeholder="Email..." onChange={this.handleInputChange} value={this.state.reAuthenticationEmail} autoComplete="off" required />
                                    <div className="profilePageFormPropertyLabel">Current password</div>
                                    <input className="profilePageFormPropertyInput" type="password" name="reAuthenticationPassword" placeholder="Password..." onChange={this.handleInputChange} value={this.state.reAuthenticationPassword} minLength="6" autoComplete="off" required />
                                    <div className="profilePageFormPropertyLabel">New password</div>
                                    <input className="profilePageFormPropertyInput" type="password" name="password" placeholder="Password..." onChange={this.handleInputChange} value={this.state.password} minLength="6" autoComplete="off" required />
                                    <div className="profilePageFormPropertyErrorLabel">
                                        {this.state.passwordEditError}
                                    </div>
                                    {this.state.passwordEditLoading ?
                                        <div className="profilePageLoader">
                                            <PulseLoader
                                                color={"#123abc"}
                                                loading={this.state.passwordEditLoading}
                                            />
                                        </div>
                                        :
                                        <div className="profilePageFormPropertyButtonHolder">
                                            <button className="profilePageFormPropertyButton">Save</button>
                                            <button className="profilePageFormPropertyButton" onClick={this.handleCancelPassword}>Cancel</button>
                                        </div>
                                    }
                                </>
                            }
                        </form>
                    </div>

                    {/* ============================== Delete account ============================== */}
                    <div className="profilePageBox">
                        <form className="profilePageForm" onSubmit={this.handleConfirmDeleteAccount}>
                            <div className="profilePageFormPropertyLabel" style={{ color: "red" }}>Delete account?</div>
                            {!this.state.deleteAccountModeActive ?
                                <div className="profilePageFormDeleteButtonsHolder">
                                    <button className="profilePageFormDeleteButton" onClick={this.handleDeleteAccount}>Delete</button>
                                </div>
                                :
                                <>
                                    <div className="profilePageFormPropertyLabel">Current email</div>
                                    <input className="profilePageFormPropertyInput" type="email" name="reAuthenticationEmail" placeholder="Email..." onChange={this.handleInputChange} value={this.state.reAuthenticationEmail} autoComplete="off" required />
                                    <div className="profilePageFormPropertyLabel">Current password</div>
                                    <input className="profilePageFormPropertyInput" type="password" name="reAuthenticationPassword" placeholder="Password..." onChange={this.handleInputChange} value={this.state.reAuthenticationPassword} minLength="6" autoComplete="off" required />
                                    <div className="profilePageFormPropertyErrorLabel">
                                        {this.state.deleteAccountError}
                                    </div>
                                    {this.state.deleteAccountLoading ?
                                        <div className="profilePageLoader">
                                            <PulseLoader
                                                color={"#123abc"}
                                                loading={this.state.deleteAccountLoading}
                                            />
                                        </div>
                                        :
                                        <div className="profilePageFormDeleteButtonsHolder">
                                            <button className="profilePageFormDeleteButton">Delete</button>
                                            <button className="profilePageFormPropertyButton" onClick={this.handleCancelDeleteAccount}>Cancel</button>
                                        </div>
                                    }
                                </>
                            }
                        </form>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(ProfilePage);