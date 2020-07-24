import React from 'react';

import './RecipesPage.css';

import NavigationBar from './NavigationBar.jsx'
import RecipesFilterSideBar from './RecipesFilterSideBar.jsx'
import RecipeList from './RecipeList.jsx'

export default class RecipesPage extends React.Component {

    render() {
        return (
            <div className="recipesPage">

                <div className="recipesPageNavigationBar">
                    <NavigationBar user={this.props.user} />
                </div>

                <div className="recipesPageSideBar">
                    <RecipesFilterSideBar />
                </div>

                <div className="recipesPageRecipeList">
                    <RecipeList user={this.props.user} />
                </div>

            </div>
        );
    }
}