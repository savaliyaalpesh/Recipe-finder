import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: "",
    image: "",
    ingredients: "",
    instructions: "",
    tags: "",
    mealType: "",
    prepTimeMinutes: "",
    cookTimeMinutes: "",
    caloriesPerServing: ""
  });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://dummyjson.com/recipes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recipe,
          ingredients: recipe.ingredients.split("\n"),
          instructions: recipe.instructions.split("\n"),
          tags: recipe.tags.split(",").map((tag) => tag.trim()),
          prepTimeMinutes: parseInt(recipe.prepTimeMinutes) || 0,
          cookTimeMinutes: parseInt(recipe.cookTimeMinutes) || 0,
          caloriesPerServing: parseInt(recipe.caloriesPerServing) || 0
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Store newly added recipe in localStorage to display on home page
        const newRecipes = JSON.parse(localStorage.getItem('addedRecipes') || '[]');
        newRecipes.push({
          ...result,
          id: Date.now(), // Use timestamp as temporary ID for local storage
          createdAt: new Date().toISOString(), // Add timestamp for "new" badge
          isNew: true // Add flag for "new" badge
        });
        localStorage.setItem('addedRecipes', JSON.stringify(newRecipes));
        
        // Show success notification
        setNotification({
          show: true,
          message: "Recipe added successfully!",
          type: "success"
        });
        
        // Redirect after a short delay to show the notification
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.error("Failed to add recipe");
        setNotification({
          show: true,
          message: "Failed to add recipe. Please try again.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      setNotification({
        show: true,
        message: "Error adding recipe. Please try again.",
        type: "error"
      });
    }
  };

  useEffect(() => {
    const options = document.querySelectorAll("select option");
    options.forEach(option => {
      option.style.backgroundColor = "#6b8e72";
      option.style.color = "black";
    });
  }, []);
  
  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  return (
    <div className="min-h-screen w-full bg-bodybackground">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === "success" ? "bg-deepforestgreen text-white" : "bg-red-600 text-white"
        }`}>
          {notification.type === "success" ? <Check className="w-5 h-5" /> : null}
          <p>{notification.message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 h-full w-full">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-heading">Add New Recipe</h1>
          <Link to="/" className="w-auto">
            <button
              className="hidden sm:block bg-deepforestgreen text-white px-6 py-2 rounded-lg hover:bg-buttonbackground transition duration-300 btn-text"
              type="button"
            >
              Back
            </button>
            <ArrowLeft className="block sm:hidden text-deepforestgreen w-6 h-6" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Recipe Name */}
          <div className="w-full">
            <label htmlFor="name" className="block text-base sm:text-lg font-medium text-paragraph">
              Recipe Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              required
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
          
          {/* Image URL */}
          <div className="w-full">
            <label htmlFor="image" className="block text-base sm:text-lg font-medium text-paragraph">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={recipe.image}
              onChange={handleChange}
              required
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Ingredients */}
          <div className="w-full">
            <label htmlFor="ingredients" className="block text-base sm:text-lg font-medium text-paragraph">
              Ingredients (one per line)
            </label>
            <textarea
              name="ingredients"
              id="ingredients"
              value={recipe.ingredients}
              onChange={handleChange}
              required
              rows="5"
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            ></textarea>
          </div>
          
          {/* Instructions */}
          <div className="w-full">
            <label htmlFor="instructions" className="block text-base sm:text-lg font-medium text-paragraph">
              Instructions (one per line)
            </label>
            <textarea
              name="instructions"
              id="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              required
              rows="5"
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tags */}
          <div className="w-full">
            <label htmlFor="tags" className="block text-base sm:text-lg font-medium text-paragraph">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={recipe.tags}
              onChange={handleChange}
              required
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
          
          {/* Meal Type */}
          <div className="w-full">
            <label htmlFor="mealType" className="block text-base sm:text-lg font-medium text-paragraph">
              Meal Type
            </label>
            <select
              name="mealType"
              id="mealType"
              value={recipe.mealType}
              onChange={handleChange}
              required
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen"
            >
              <option value="">Select meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
        
        {/* Added cooking info fields for RecipeCard display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Prep Time */}
          <div className="w-full">
            <label htmlFor="prepTimeMinutes" className="block text-base sm:text-lg font-medium text-paragraph">
              Prep Time (mins)
            </label>
            <input
              type="number"
              name="prepTimeMinutes"
              id="prepTimeMinutes"
              value={recipe.prepTimeMinutes}
              onChange={handleChange}
              required
              min="0"
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
          
          {/* Cook Time */}
          <div className="w-full">
            <label htmlFor="cookTimeMinutes" className="block text-base sm:text-lg font-medium text-paragraph">
              Cook Time (mins)
            </label>
            <input
              type="number"
              name="cookTimeMinutes"
              id="cookTimeMinutes"
              value={recipe.cookTimeMinutes}
              onChange={handleChange}
              required
              min="0"
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
          
          {/* Calories */}
          <div className="w-full">
            <label htmlFor="caloriesPerServing" className="block text-base sm:text-lg font-medium text-paragraph">
              Calories Per Serving
            </label>
            <input
              type="number"
              name="caloriesPerServing"
              id="caloriesPerServing"
              value={recipe.caloriesPerServing}
              onChange={handleChange}
              required
              min="0"
              className="mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 w-full md:w-auto bg-deepforestgreen text-white rounded hover:bg-cardtext focus:outline-none focus:ring-2 focus:ring-darkbrown transition-colors duration-200 btn-text text-lg"
          >
            Add Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;