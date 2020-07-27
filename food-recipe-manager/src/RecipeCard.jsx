import React from 'react';
import './RecipeCard.css';

export default class RecipeCard extends React.Component {

    render() {
        const recipe = this.props.recipe;
        return (
            <li className="recipeCard">
                <div>
                    Name: {recipe.name}
                    <br />
                    Category: {recipe.category}
                    <br />
                    Type: {recipe.type}
                </div>
            </li>
        );
    }

}