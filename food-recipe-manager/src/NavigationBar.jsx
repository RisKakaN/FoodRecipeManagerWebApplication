import React from 'react';

import './NavigationBar.css';

import { auth } from './Firebase.js';

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { searchValue: '' };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleSearchChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    handleSearchSubmit(event) {
        alert('Search: ' + this.state.searchValue);
        event.preventDefault();
    }

    logout() {
        auth.signOut()
            .then(() => {
                console.log('Signed out')
            });
    }

    render() {
        return (
            <div className="navigationBar">
                <div className="navigationBarHomeButton">
                    FoodRecipeManager
                </div>
                <div className="navigationBarSearchField">
                    <form className="navigationBarSearchFieldForm" onSubmit={this.handleSearchSubmit}>
                        <label>
                            <input className="navigationBarSearchFieldInput" type="text" value={this.state.searchValue} onChange={this.handleSearchChange} />
                        </label>
                        <input className="navigationBarSearchFieldButton" type="submit" value="Search" />
                    </form>
                </div>
                <div className="navigationBarProfileButton">
                    <button onClick={this.logout}>Logout</button>
                    {this.props.user.displayName}
                </div>
            </div>
        );
    }

}