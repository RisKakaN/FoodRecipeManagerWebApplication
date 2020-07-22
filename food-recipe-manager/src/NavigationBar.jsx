import React from 'react';

import './NavigationBar.css';

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { searchValue: '' };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    handleSearchChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    handleSearchSubmit(event) {
        alert('Search: ' + this.state.searchValue);
        event.preventDefault();
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
                    TBD Profile
                </div>

            </div>
        );
    }

}