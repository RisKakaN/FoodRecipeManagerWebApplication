import React from 'react';
import RecipesFilterSideBar from './RecipesFilterSideBar.jsx'
import RecipeList from './RecipeList.jsx'
import './RecipesPage.css';

export default class RecipesPage extends React.Component {

    render() {
        return (
            <div className="recipesPage">
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