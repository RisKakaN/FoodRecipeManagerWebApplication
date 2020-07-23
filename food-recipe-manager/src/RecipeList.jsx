import React from 'react';

import './RecipeList.css';

import Firebase, { auth } from './Firebase.js';
import RecipeCard from './RecipeCard.jsx'

export default class RecipeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            email: '',
            password: '',
            recipes: [],
        };

        this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        // Check whether a user is already logged in.
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('User exists...');
                this.setState({ user: user });
                this.fetchFromFirebase();
            }
        });
    }

    fetchFromFirebase() {
        console.log('Start fetching data...');
        const recipesRef = Firebase.database().ref('recipes/' + this.state.user.uid);

        recipesRef.once('value', (snapshot) => {
            this.setState({
                recipes: snapshot.val()
            });
        });
    }

    handleLoginInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    login(e) {
        e.preventDefault();
        console.log('Attempt to login...');
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            // Handle Errors here.
            console.log('Login failed!');
            var errorCode = error.code;
            console.log('errorCode: ' + errorCode);
            var errorMessage = error.message;
            console.log('errorMessage: ' + errorMessage);
        });
    }

    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null,
                    recipes: [],
                });
            });
    }

    render() {
        return (
            <div className="recipeList">
                {this.state.user ?
                    <div>
                        Logged in as: {this.state.user.displayName}
                        <button onClick={this.logout}>Logout</button>
                        <ul>
                            {this.state.recipes.map((recipe) => {
                                return <RecipeCard key={recipe.name} recipe={recipe} />;
                            })}
                        </ul>
                    </div>
                    :
                    <form onSubmit={this.login}>
                        <input type="email" name="email" placeholder="Email..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.email} />
                        <input type="password" name="password" placeholder="Password..." autoComplete="on" onChange={this.handleLoginInputChange} value={this.state.password} />
                        <button>Login</button>
                    </form>
                }
            </div>
        );
    }
}