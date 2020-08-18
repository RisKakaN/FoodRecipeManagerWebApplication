import React from 'react';
import Firebase from './Firebase.js';
import PulseLoader from "react-spinners/PulseLoader";
import RecipeCard from './RecipeCard.jsx'
import searchIcon from './assets/searchIcon.png';
import './RecipeList.css';

export default class RecipeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataLoading: true,
            recipes: [],
            dataIsEmpty: false,
            searchValue: ""
        };

        this.isComponentMounted = false;

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.user) {
            this.isComponentMounted = true;
            this.timeOutId = setTimeout(() => {
                this.fetchDataFromFirebase();
            }, 100);
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

    handleSearchChange(e) {
        this.setState({ searchValue: e.target.value });
    }

    handleSearchSubmit(e) {
        e.preventDefault();
        // Not needed for now...
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
                        <>
                            <form className="recipeListSearch" onSubmit={this.handleSearchSubmit}>
                                <input className="recipeListSearchInput" type="text" placeholder="Search recipes..." value={this.state.searchValue} onChange={this.handleSearchChange} />
                                <div className="recipeListSearchButton" onClick={this.handleSearchSubmit}>
                                    <img src={searchIcon} alt="Search" />
                                </div>
                            </form>
                            <ul>
                                {Object.keys(recipes).map((recipe) => {
                                    if (recipes[recipe].name.toLowerCase().includes(this.state.searchValue.toLowerCase())) {
                                        return <RecipeCard key={recipes[recipe].name} recipe={recipes[recipe]} />;
                                    }
                                })}
                            </ul>
                        </>
                    : <div className="recipeListEmpty">You currently have no recipes. Please add recipes :)</div>}
            </div>
        );
    }
}