import React from 'react';
import Firebase from './Firebase.js';
import PulseLoader from "react-spinners/PulseLoader";
import RecipeCard from './RecipeCard.jsx'
import './RecipeList.css';

export default class RecipeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLoading: true,
            recipes: [],
        };
    }

    componentDidMount() {
        if (this.props.user) {
            setTimeout(() => {
                this.fetchDataFromFirebase();
            }, 500);
        }
    }

    fetchDataFromFirebase() {
        const recipesRef = Firebase.database().ref('recipes/' + this.props.user.uid);
        recipesRef.once('value', (snapshot) => {
            this.setState({
                dataLoading: false,
                recipes: snapshot.val()
            });
        });
    }

    render() {
        return (
            <div className="recipeList">
                {this.state.dataLoading ?
                    <div className="recipeListDataLoader">
                        <PulseLoader
                            size={15}
                            color={"#123abc"}
                            loading={this.state.dataLoading}
                        />
                    </div>
                    :
                    <ul>
                        {this.state.recipes.map((recipe) => {
                            return <RecipeCard key={recipe.name} recipe={recipe} />;
                        })}
                    </ul>
                }
            </div>
        );
    }
}