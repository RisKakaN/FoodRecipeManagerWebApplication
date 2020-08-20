import React from 'react';
import { Redirect, withRouter } from "react-router-dom";
import './RegistrationCompletePage.css';

class RegistrationCompletePage extends React.Component {

    constructor(props) {
        super(props);

        this.handleProceedClick = this.handleProceedClick.bind(this);
    }

    handleProceedClick() {
        this.props.history.push("/");
    }

    render() {
        const pageAccessible = true ? ((typeof this.props.location.state !== "undefined") && this.props.location.state.registrationComplete) : false;
        if (this.props.user && !pageAccessible) {
            return <Redirect to={'/recipes'} />;
        } else if (pageAccessible) {
            return (
                <div className="registrationCompletePage">
                    <div className="registrationCompletePageBox">
                        <div className="registrationCompletePageBoxHeader">Registration complete</div>
                        <div className="registrationCompletePageBoxInfo">You will now be able to store your food recipes online! And don't forget to verify your email for your best user experience.</div>
                        <button className="registrationCompletePageBoxButton" onClick={this.handleProceedClick}>Proceed to login</button>
                    </div>
                </div>
            );
        } else {
            return <Redirect to={'/'} />;
        }
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RegistrationCompletePage);