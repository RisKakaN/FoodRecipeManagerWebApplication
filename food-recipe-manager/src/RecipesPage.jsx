import React from 'react';
import { withRouter } from 'react-router-dom';
import PulseLoader from "react-spinners/PulseLoader";
import addRecipeIcon from './assets/addRecipeIcon.png';
import searchIcon from './assets/searchIcon.png';
import Firebase from './Firebase.js';
import RecipeCard from './RecipeCard.jsx';
import './RecipesPage.css';

class RecipesPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataLoading: true,
            recipes: [],
            dataIsEmpty: false,
            searchValue: "",

            // Filters:
            activeFilters: [],
            meatFilterOn: false,
            vegetarianFilterOn: false,
            veganFilterOn: false,
            breakfastFilterOn: false,
            lightmealFilterOn: false,
            heavymealFilterOn: false,
            dessertFilterOn: false,
        };

        this.isComponentMounted = false;

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleAddNewRecipe = this.handleAddNewRecipe.bind(this);
        this.handleFilterClick = this.handleFilterClick.bind(this);
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
        e.preventDefault();
        this.setState({ searchValue: e.target.value });
    }

    handleAddNewRecipe() {
        this.props.history.push("/recipes/add/");
    }

    handleFilterClick(stateName, status, name) {
        if (status) {
            // Add seclected filter to the filter list.
            this.setState(prevState => ({
                activeFilters: [...prevState.activeFilters, name],
                [stateName]: status
            }));
        } else {
            // Remove selected filter from the filter list.
            this.setState(prevState => ({
                activeFilters: prevState.activeFilters.filter(activeFilter => activeFilter !== name),
                [stateName]: status
            }));
        }
    }

    filterRecipes() {
        let filteredRecipes = [];
        if (this.state.activeFilters.length > 0) {
            Object.values(this.state.recipes).forEach((recipe) => {
                const activeFilters = this.state.activeFilters;
                for (const activeFilter of activeFilters) {
                    if (activeFilter === recipe.category || activeFilter === recipe.type) {
                        let index = filteredRecipes.findIndex(filteredRecipe => filteredRecipe.name === recipe.name);
                        if (index === -1) {
                            filteredRecipes.push(recipe)
                            break;
                        }
                    }
                }
            })
            return filteredRecipes;
        } else {
            return Object.values(this.state.recipes);
        }
    }

    render() {
        return (
            <div className="recipesPage">
                {!this.state.dataIsEmpty ?
                    this.state.dataLoading ?
                        <div className="recipesPageDataLoader">
                            <PulseLoader
                                size={15}
                                color={"#123abc"}
                                loading={this.state.dataLoading}
                            />
                        </div>
                        :
                        <>
                            <div className="recipesPageActions">
                                <div className="recipesPageActionsTop">
                                    <form className="recipesPageSearch">
                                        <div className="recipesPageSearchButton">
                                            <img src={searchIcon} alt="Search" />
                                        </div>
                                        <input className="recipesPageSearchInput" type="text" placeholder="Search recipes..." value={this.state.searchValue} onChange={this.handleSearchChange} />
                                    </form>
                                    <div className="recipesPageAddNewRecipe" onClick={this.handleAddNewRecipe}>
                                        <img src={addRecipeIcon} alt="Search" />
                                            Add
                                        </div>
                                </div>
                                <div className="recipesPageFilterContainer">
                                    <div className="recipesPageFilterLabel">Filters:</div>
                                    <div className="recipesPageFilters">
                                        <Filter stateName={"meatFilterOn"} status={this.state.meatFilterOn} name={"Meat"} handleFilterClick={this.handleFilterClick} />
                                        <Filter stateName={"vegetarianFilterOn"} status={this.state.vegetarianFilterOn} name={"Vegetarian"} handleFilterClick={this.handleFilterClick} />
                                        <Filter stateName={"veganFilterOn"} status={this.state.veganFilterOn} name={"Vegan"} handleFilterClick={this.handleFilterClick} />
                                        <Filter stateName={"breakfastFilterOn"} status={this.state.breakfastFilterOn} name={"Breakfast"} handleFilterClick={this.handleFilterClick} />
                                        <Filter stateName={"lightmealFilterOn"} status={this.state.lightmealFilterOn} name={"Light meal"} handleFilterClick={this.handleFilterClick} />
                                        <Filter stateName={"heavymealFilterOn"} status={this.state.heavymealFilterOn} name={"Heavy meal"} handleFilterClick={this.handleFilterClick} />
                                        <Filter stateName={"dessertFilterOn"} status={this.state.dessertFilterOn} name={"Dessert"} handleFilterClick={this.handleFilterClick} />
                                    </div>
                                </div>
                            </div>
                            <ul>
                                {this.filterRecipes().map((recipe) => {
                                    if (recipe.name.toLowerCase().includes(this.state.searchValue.toLowerCase())) {
                                        return <RecipeCard key={recipe.name} recipe={recipe} />;
                                    } else {
                                        return null;
                                    }
                                })}
                            </ul>
                        </>
                    : <div className="recipesPageEmpty">You currently have no recipes. Please add recipes :)</div>}
            </div>
        );
    }
}

function Filter(props) {
    return (
        <div
            className="recipesPageFilterItem"
            onClick={() => props.handleFilterClick(props.stateName, !props.status, props.name)}
            style={props.status ?
                { backgroundColor: "white", color: "#373737" }
                :
                { backgroundColor: "#373737", color: "white" }}>
            {props.name}
        </div>
    );
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RecipesPage);