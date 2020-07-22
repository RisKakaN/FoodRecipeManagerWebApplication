import React from 'react';

import './RecipeCard.css';

export default class RecipeCard extends React.Component {

    render() {
        console.log('props: ' + this.props.name);
        return (
            <li>
                <div className="recipeCard">
                    abc: {this.props.name}
                </div>
            </li>
        );
    }

}