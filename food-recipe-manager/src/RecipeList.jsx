import React from 'react';

import './RecipeList.css';

import Firebase from './Firebase.js';
import RecipeCard from './RecipeCard.jsx'

export default class RecipeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recipes: [],
        };
    }

    componentDidMount() {
        if (this.props.user) {
            this.fetchFromFirebase();
        }
    }

    fetchFromFirebase() {
        const recipesRef = Firebase.database().ref('recipes/' + this.props.user.uid);

        recipesRef.once('value', (snapshot) => {
            this.setState({
                recipes: snapshot.val()
            });
        });
    }

    render() {
        return (
            <div className="recipeList">
                <ul>
                    {this.state.recipes.map((recipe) => {
                        return <RecipeCard key={recipe.name} recipe={recipe} />;
                    })}
                </ul>
            </div>
        );
    }
}