import React, { useState } from 'react';
import './App.css';
import BasicButtons from '../components/basicButton';
import { TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

function App() {
  const [queryType, setQueryType] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleQueryTypeChange = (event) => {
    setQueryType(event.target.value);
    setQuery('');
    setResult(null);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    let url = '';
    switch (queryType) {
      case 'searchByName':
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        break;
      case 'listByFirstLetter':
        url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`;
        break;
      case 'lookupById':
        url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${query}`;
        break;
      case 'randomMeal':
        url = `https://www.themealdb.com/api/json/v1/1/random.php`;
        break;
      case 'listCategories':
        url = `https://www.themealdb.com/api/json/v1/1/categories.php`;
        break;
      case 'listAllCategories':
        url = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;
        break;
      case 'listAllAreas':
        url = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`;
        break;
      case 'listAllIngredients':
        url = `https://www.themealdb.com/api/json/v1/1/list.php?i=list`;
        break;
      case 'filterByIngredient':
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;
        break;
      case 'filterByCategory':
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`;
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched Data:', data); // Log the fetched data
      setResult(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (queryType) {
      case 'listCategories':
        return (
          <Grid container spacing={3}>
            {result.categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.idCategory}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={category.strCategory}
                    height="140"
                    image={category.strCategoryThumb}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {category.strCategory}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.strCategoryDescription}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 'searchByName':
      case 'listByFirstLetter':
      case 'lookupById':
      case 'filterByIngredient':
      case 'filterByCategory':
        return (
          <Grid container spacing={3}>
            {result.meals.map((meal) => (
              <Grid item xs={12} sm={6} md={4} key={meal.idMeal}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={meal.strMeal}
                    height="140"
                    image={meal.strMealThumb}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {meal.strMeal}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.strCategory} - {meal.strArea}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 'randomMeal':
        if (result.meals && result.meals.length > 0) {
          const meal = result.meals[0];
          return (
            <Card>
              <CardMedia
                component="img"
                alt={meal.strMeal}
                height="140"
                image={meal.strMealThumb}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {meal.strMeal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {meal.strCategory} - {meal.strArea}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {meal.strInstructions}
                </Typography>
              </CardContent>
            </Card>
          );
        }
        return null;
      case 'listAllCategories':
      case 'listAllAreas':
      case 'listAllIngredients':
        return (
          <Grid container spacing={3}>
            {result.meals && result.meals.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.strCategory || item.strArea || item.strIngredient}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Query Type</InputLabel>
        <Select value={queryType} onChange={handleQueryTypeChange}>
          <MenuItem value="searchByName">Search meal by name</MenuItem>
          <MenuItem value="listByFirstLetter">List all meals by first letter</MenuItem>
          <MenuItem value="lookupById">Lookup full meal details by id</MenuItem>
          <MenuItem value="randomMeal">Lookup a single random meal</MenuItem>
          <MenuItem value="listCategories">List all meal categories</MenuItem>
          <MenuItem value="listAllCategories">List all Categories</MenuItem>
          <MenuItem value="listAllAreas">List all Areas</MenuItem>
          <MenuItem value="listAllIngredients">List all Ingredients</MenuItem>
          <MenuItem value="filterByIngredient">Filter by main ingredient</MenuItem>
          <MenuItem value="filterByCategory">Filter by Category</MenuItem>
        </Select>
      </FormControl>

      {(queryType !== 'randomMeal' && queryType !== 'listCategories' && queryType !== 'listAllCategories' && queryType !== 'listAllAreas' && queryType !== 'listAllIngredients') && (
        <TextField value={query} onChange={handleInputChange} label="Query" variant="outlined" fullWidth margin="normal" />
      )}
      
      <BasicButtons onSearch={handleSearch} />

      {result && (
        <div>
          <h2>Result:</h2>
          {renderResult()}
        </div>
      )}
    </div>
  );
}

export default App;
