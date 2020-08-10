import React from 'react';
import { withRouter } from 'react-router-dom';
import './RecipeCard.css';

class RecipeCard extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push(
            "/recipes/details/" + this.props.recipe.name,
            { recipe: this.props.recipe }
        );
    }

    render() {
        const recipe = this.props.recipe;
        return (
            <li className="recipeCard" onClick={this.handleClick}>
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

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RecipeCard);