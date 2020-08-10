import React from 'react';
import { withRouter } from 'react-router-dom';
import './RecipesFilterSideBar.css';

class RecipesFilterSideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.addNewRecipe = this.addNewRecipe.bind(this);
    }

    addNewRecipe() {
        this.props.history.push(
            "/recipes/add/"
        );
    }

    render() {
        return (
            <div className="recipesFilterSideBar">
                <div className="recipesFilterSideBarFilters">
                    TBD Filter1
                    <br />
                    TBD Filter2
                </div>
                {/* <div style={{height: '50px', backgroundColor: 'blue'}}>1</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>2</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>3</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>4</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>5</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>6</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>7</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>8</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>9</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>10</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>11</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>12</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>13</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>1</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>2</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>3</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>4</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>5</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>6</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>7</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>8</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>9</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>10</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>11</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>12</div>
                <div style={{height: '50px', backgroundColor: 'blue'}}>13</div> */}
                <div className="recipesFilterSideBarAddNewRecipe">
                    <button className="recipesFilterSideBarAddNewRecipeButton" type="button" onClick={this.addNewRecipe}>
                        Add new recipe
                    </button>
                </div>
            </div>
        );
    }

}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(RecipesFilterSideBar);