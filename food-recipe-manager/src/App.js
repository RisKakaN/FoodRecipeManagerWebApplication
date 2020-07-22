import React from 'react';
import './App.css';

import NavigationBar from './NavigationBar.jsx'
import RecipesFilterSideBar from './RecipesFilterSideBar.jsx'
import RecipeList from './RecipeList.jsx'

function App() {
  return (
    <div className="app">

      <div className="appNavigationBar">
        <NavigationBar />
      </div>

      <div className="appSideBar">
        <RecipesFilterSideBar />
      </div>

      <div className="appRecipeList">
        <RecipeList />
      </div>

    </div>
  );
}

export default App;
