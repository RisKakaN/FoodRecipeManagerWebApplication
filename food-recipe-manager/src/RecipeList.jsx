import React from 'react';

import './RecipeList.css';

import RecipeCard from './RecipeCard.jsx'

export default class RecipeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [
                {
                    name: 'test name 1', type: 'breakfast'
                },
                {
                    name: 'test name 2', type: 'lunch'
                },
                {
                    name: 'test name 3', type: 'dinner'
                },
                {
                    name: 'test name 4', type: 'breakfast'
                },
                {
                    name: 'test name 5', type: 'lunch'
                },
                {
                    name: 'test name 6', type: 'dinner'
                },
                {
                    name: 'test name 7', type: 'breakfast'
                },
                {
                    name: 'test name 8', type: 'lunch'
                },
                {
                    name: 'test name 9', type: 'dinner'
                },
                {
                    name: 'test name 10', type: 'breakfast'
                },
                {
                    name: 'test name 11', type: 'lunch'
                },
                {
                    name: 'test name 12', type: 'dinner'
                },
            ],
        };
    }

    render() {
        return (
            <div className="recipeList">
                <ul>
                    {this.state.recipes.map((recipe) => {
                        return <RecipeCard key={recipe.name} name={recipe.name} />;
                    })}
                </ul>
            </div>
        );
    }

}