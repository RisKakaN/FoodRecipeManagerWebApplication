import React from 'react';
import { withRouter } from 'react-router-dom';
import './ResetPasswordPage.css';

class ResetPasswordPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="resetPasswordPage">
                TBD
            </div>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(ResetPasswordPage);