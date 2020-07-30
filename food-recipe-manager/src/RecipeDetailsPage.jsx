import React from 'react';
import Firebase from './Firebase.js';
import PulseLoader from "react-spinners/PulseLoader";
import './RecipeDetailsPage.css';

export default class RecipeDetailsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            renderPageNotFound: false,
            recipe: ((typeof this.props.location.state !== "undefined") ? this.props.location.state.recipe : null),
        };

        this.dataLoading = false;
        this.dataRequested = false;
        this.isComponentMounted = false;
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    fetchRecipeFromFirebase(userId, recipeName) {
        this.dataRequested = true;
        const recipeRef = Firebase.database().ref('recipes/' + userId);
        recipeRef.orderByChild('name').equalTo(recipeName).once('value', (snapshot) => {
            if (snapshot.val()) {
                if (this.isComponentMounted) {
                    this.setState({
                        recipe: Object.values(snapshot.val())[0]
                    });
                    this.dataLoading = false;
                }
            } else {
                // Trying to enter a url for a recipe that does not exist will cause redirection to NotFoundPage.
                this.props.history.replace("/404");
            }
        });
    }

    render() {
        if (this.state.recipe) {
            this.dataLoading = false;
        } else {
            this.dataLoading = true;
            if (!this.dataRequested) {
                this.fetchRecipeFromFirebase(this.props.user.uid, this.props.match.params.recipeRouteName);
            }
        }

        const recipe = this.state.recipe;
        return (
            <div className="recipeDetailsPage">
                {!this.dataLoading ?
                    <div className="recipeDetailsPageContent">
                        Name: {recipe.name}
                        <br />
                        <br />
                        Category: {recipe.category}
                        <br />
                        <br />
                        Type: {recipe.type}
                        <br />
                        <br />
                        Time: {recipe.time}
                        <br />
                        <br />
                        Ingredients:
                        <br />
                        <ul>
                            {(recipe.ingredients).map((ingredient) => {
                                return (
                                    <li key={ingredient.name}>
                                        {ingredient.amount} {ingredient.unit === "N/A" ? null : ingredient.unit} {ingredient.name}
                                    </li>
                                );
                            })}
                        </ul>
                        <br />
                        Instructions:
                        <br />
                        {recipe.instructions}
                    </div>
                    :
                    <div className="recipeDetailsPageDataLoader">
                        <PulseLoader
                            size={15}
                            color={"#123abc"}
                            loading={this.dataLoading}
                        />
                    </div>
                }
            </div>
        );
    }
}