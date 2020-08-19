import React from 'react';
import { withRouter } from 'react-router-dom';
import noPhotoAvailablePlaceholder from './assets/noPhotoAvailablePlaceholder.png';
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
            <div className="recipeCard" onClick={this.handleClick}>
                <div className="recipeCardPhotoFrame">
                    {this.props.recipe.photoDownloadUri ?
                        <img className="recipeCardPhoto" src={this.props.recipe.photoDownloadUri} alt="Not available" />
                        :
                        <img className="recipeCardPhoto" src={noPhotoAvailablePlaceholder} alt="Not available" style={{ width: "190px", height: "190px" }} />
                    }
                </div>
                <div className="recipeCardName">
                    {recipe.name}
                </div>
                <div className="recipeCardCategory">
                    Category: {recipe.category}
                </div>
                <div className="recipeCardType">
                    Type: {recipe.type}
                </div>
                <div className="recipeCardTime">
                    Time: {recipe.timeHours} hours, {recipe.timeMinutes} mins
                </div>
            </div>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RecipeCard);