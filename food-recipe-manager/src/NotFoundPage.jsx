import React from "react";
import "./NotFoundPage.css";

export default class NotFoundPage extends React.Component {
    render() {
        return (
            <div className="notFoundPage">
                <h1>Oops!<span style={{ marginLeft: "20px" }}>:(</span></h1>
                <h4>The page could not be found</h4>
            </div>
        );
    }
}