import React from "react";
import { auth, storage } from "./Firebase.js";
import { Redirect, withRouter } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import profilePhotoPlaceholder from "./assets/profilePhotoPlaceholder.png";
import "./RegistrationPage.css";

class RegistrationPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            photoPreview: null,
            photoEditError: null,
            photoEditModeActive: false,
            email: "",
            password: "",
            displayName: "",
            registrationLoading: false,
            registrationFailMessage: null
        };

        this.handleChangePhoto = this.handleChangePhoto.bind(this);
        this.handleRemovePhoto = this.handleRemovePhoto.bind(this);
        this.handleCancelPhotoEditMode = this.handleCancelPhotoEditMode.bind(this);
        this.handleActivatePhotoEditMode = this.handleActivatePhotoEditMode.bind(this);

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

    handleActivatePhotoEditMode(e) {
        e.preventDefault();
        this.setState({
            photoEditModeActive: true
        });
    }

    handleCancelPhotoEditMode(e) {
        e.preventDefault();
        this.setState({
            photoEditModeActive: false,
            photoEditError: null
        });
    }

    handleChangePhoto(e) {
        e.preventDefault();
        const photo = e.target.files[0];
        if (photo) {
            if (photo.size > 10000000) {
                this.setState({
                    photoEditError: "The photo is too big. Maximum size ~10mb."
                })
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        photoEditModeActive: false,
                        photo: photo,
                        photoPreview: reader.result,
                        photoEditError: null
                    });
                }
                reader.readAsDataURL(photo);
            }
        } else {
            this.setState({
                photoEditError: "The photo could not be loaded. Please try again."
            })
        }
    }

    handleRemovePhoto(e) {
        e.preventDefault();
        this.setState({
            photoEditModeActive: false,
            photo: null,
            photoPreview: null,
            photoEditError: null
        });
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

                    if (this.state.photo) {
                        const storageRef = storage.ref("images/" + auth.currentUser.uid + "/profile_photo");
                        storageRef.put(this.state.photo).then(() => {
                            storageRef.getDownloadURL().then((url) => {
                                if (this.isComponentMounted) {
                                    // Set user's display name and photo:
                                    auth.currentUser.updateProfile({
                                        displayName: this.state.displayName,
                                        photoURL: url,
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
                            }).catch(() => {
                                // Error: Could not fetch the photo DownloadURL from Firebase Storage.
                                // !TODO: Profile photo upload failure is currently not handled properly.
                                auth.signOut().then(() => {
                                    this.props.history.push(
                                        "/registration-complete",
                                        { registrationComplete: true }
                                    );
                                });
                            });
                        }).catch(() => {
                            // Error: Photo could not be uploaded to Firebase Storage.
                            // !TODO: Profile photo upload failure is currently not handled properly.
                            auth.signOut().then(() => {
                                this.props.history.push(
                                    "/registration-complete",
                                    { registrationComplete: true }
                                );
                            });
                        });
                    } else {
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
            return <Redirect to={"/user/recipes"} />;
        } else {
            return (
                <div className="registrationPage">
                    <div className="registrationPageTitle">Create your account</div>
                    <div className="registrationPageBox">
                        <form className="registrationPageForm" onSubmit={this.handleRegistrationClick}>

                            {this.state.photoEditModeActive ?
                                <div className="registrationPagePhotoEditMode">
                                    <label className="registrationPagePhotoEditModeButton">
                                        <input className="registrationPagePhotoEditModeInput" type="file" name="photo" accept="image/*" onClick={e => e.target.value = null} onChange={this.handleChangePhoto} />
                                        {this.state.photo ? "Change" : "Add"}
                                    </label>
                                    {this.state.photo && <button className="registrationPagePhotoEditModeButton" onClick={this.handleRemovePhoto}>Remove</button>}
                                    <button className="registrationPagePhotoEditModeButton" onClick={this.handleCancelPhotoEditMode}>Cancel</button>
                                </div>
                                :
                                <div className="registrationPagePhotoHolder" onClick={this.handleActivatePhotoEditMode}>
                                    {this.state.photo ?
                                        <div className="registrationPagePhoto"><img src={this.state.photoPreview} alt="Click to change"></img></div>
                                        :
                                        <img className="registrationPagePhotoPlaceholderImage" src={profilePhotoPlaceholder} alt="Click to add" ></img>
                                    }
                                </div>
                            }
                            {this.state.photoEditError && <div className="registrationPageErrorMessage">{this.state.photoEditError}</div>}


                            <div className="registrationPageLabel">Name</div>
                            <input className="registrationPageInput" type="text" name="displayName" placeholder="Name..." autoComplete="on" onChange={this.handleRegistrationInputChange} value={this.state.displayName} minLength="1" maxLength="15" required />
                            <div className="registrationPageLabel">Email</div>
                            <input className="registrationPageInput" type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleRegistrationInputChange} value={this.state.email} required />
                            <div className="registrationPageLabel">Password</div>
                            <input className="registrationPageInput" type="password" name="password" placeholder="Password..." autoComplete="on" onChange={this.handleRegistrationInputChange} value={this.state.password} minLength="6" required />
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