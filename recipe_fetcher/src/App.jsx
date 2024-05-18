import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BasicButtons from '../components/basicButton'
import { TextField } from '@mui/material'

function App() {
  const [query, setQuery] = useState('');
  const [recipe, setRecipe] = useState(null);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      setRecipe(data.meals ? data.meals[0] : null);
    } catch (error) {
      console.error("Error fetching the recipe:", error);
    }
  };

  return (
    <div>
      <TextField value={query} onChange={handleInputChange} label="Search Recipe" variant="outlined" />
      <BasicButtons onSearch={handleSearch} />
      {recipe && (
        <div>
          <h2>{recipe.strMeal}</h2>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
          <p>{recipe.strInstructions}</p>
        </div>
      )}
    </div>
  );
}

export default App
