import React from "react";
import { withRouter } from "react-router-dom";
import noPhotoAvailablePlaceholder from "./assets/noPhotoAvailablePlaceholder.png";
import "./RecipeCard.css";

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
                    <div className="recipeCardNameValue">{recipe.name}</div>
                </div>
                <div className="recipeCardProperty">
                    <div className="recipeCardPropertyLabel">Category:</div>
                    <div className="recipeCardPropertyValue">{recipe.category}</div>
                </div>
                <div className="recipeCardProperty">
                    <div className="recipeCardPropertyLabel">Type:</div>
                    <div className="recipeCardPropertyValue">{recipe.type}</div>
                </div>
                <div className="recipeCardProperty">
                    <div className="recipeCardPropertyLabel">Time:</div>
                    <div className="recipeCardPropertyValue" style={{ marginRight: "5px" }}>{recipe.timeHours}</div>
                    <div className="recipeCardPropertyValue" style={{ marginRight: "5px" }}>hours, </div>
                    <div className="recipeCardPropertyValue" style={{ marginRight: "5px" }}>{recipe.timeMinutes}</div>
                    <div className="recipeCardPropertyValue">mins</div>
                </div>
            </div>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RecipeCard);