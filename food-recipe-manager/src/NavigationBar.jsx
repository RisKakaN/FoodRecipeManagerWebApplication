import React from 'react';
import { auth } from './Firebase.js';
import { useHistory } from "react-router-dom";
import navigationBarLogo from './assets/navigationBarLogo.png';
import './NavigationBar.css';

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
                <div className="navigationBarHomeButton" onClick={this.homeButtonClick}>
                    <img src={navigationBarLogo} alt="Logo" />
                    FoodRecipeManager
                </div>
                <HomeButton />
                <div className="navigationBarSearchField">
                    <form className="navigationBarSearchFieldForm" onSubmit={this.handleSearchSubmit}>
                        <label>
                            <input className="navigationBarSearchFieldInput" type="text" placeholder="Search recipes..." value={this.state.searchValue} onChange={this.handleSearchChange} />
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

function HomeButton() {
    const history = useHistory();

    function handleClick() {
        history.push("");
    }

    return (
        <button type="button" onClick={handleClick}>
            Go home
        </button>
    );
}