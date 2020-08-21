import React from 'react';
import { Redirect } from "react-router-dom";
import './GoodByePage.css';

export default class GoodByePage extends React.Component {

    render() {
        const pageAccessible = true ? ((typeof this.props.location.state !== "undefined") && this.props.location.state.accountDeletionComplete) : false;
        if (pageAccessible) {
            return (
                <div className="goodByePage">
                    <h1>Good bye...   ;(</h1>
                    <h4>Sad to see you leave us!</h4>
                </div>
            );
        } else {
            return <Redirect to={'/404'} />;
        }
    }
}