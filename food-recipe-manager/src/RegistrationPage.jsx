import React from 'react';
import { withRouter } from 'react-router-dom';
import './RegistrationPage.css';

class RegistrationPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="registrationPage">
                TBD
            </div>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RegistrationPage);