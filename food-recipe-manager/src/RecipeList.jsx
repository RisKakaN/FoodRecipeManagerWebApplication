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
            dataIsEmpty: false,
        };

        this.isComponentMounted = false;
    }

    componentDidMount() {
        if (this.props.user) {
            this.isComponentMounted = true;
            this.timeOutId = setTimeout(() => {
                this.fetchDataFromFirebase();
            }, 300);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutId);
        this.isComponentMounted = false;
    }

    fetchDataFromFirebase() {
        const recipesRef = Firebase.database().ref('recipes/' + this.props.user.uid);
        recipesRef.once('value', (snapshot) => {
            if (this.isComponentMounted) {
                if (snapshot.val()) {
                    this.setState({
                        dataLoading: false,
                        recipes: snapshot.val()
                    });
                } else {
                    this.setState({
                        dataLoading: false,
                        dataIsEmpty: true
                    });
                }
            }
        });
    }

    render() {
        const recipes = this.state.recipes;
        return (

            <div className="recipeList">
                {!this.state.dataIsEmpty ?

                    this.state.dataLoading ?
                        <div className="recipeListDataLoader">
                            <PulseLoader
                                size={15}
                                color={"#123abc"}
                                loading={this.state.dataLoading}
                            />
                        </div>
                        :
                        <ul>
                            {Object.keys(recipes).map((recipe) => {
                                return <RecipeCard key={recipes[recipe].name} recipe={recipes[recipe]} />;
                            })}
                        </ul>

                    : <div>empty</div>}
            </div>
        );
    }
}