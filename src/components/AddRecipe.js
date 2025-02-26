import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: "",
    image: "",
    ingredients: "",
    instructions: "",
    tags: "",
    mealType: ""
  });

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
        }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to add recipe");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  useEffect(() => {
    const options = document.querySelectorAll("select option");
    options.forEach(option => {
      option.style.backgroundColor = "#6b8e72";
      option.style.color = "black";
    });
  }, []);
  
  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-bodybackground backdrop-blur-xl shadow-md rounded-lg p-4 sm:p-6 h-full max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 mb-4 sm:mb-6 min-w-0">

          <h1 className="text-2xl sm:text-3xl font-bold text-heading whitespace-nowrap">Add New Recipe</h1>
          <Link to="/" className="w-auto">
            <button
              className="bg-deepforestgreen text-white px-6 py-2 rounded-lg hover:bg-buttonbackground transition duration-300 btn-text"
              type="button"
            >
              Back
            </button>
          </Link>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 sm:space-y-4">
          <div>
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
              className="mt-1 sm:mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
          
          <div>
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
              className="mt-1 sm:mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-base sm:text-lg font-medium text-paragraph">
              Ingredients (one per line)
            </label>
            <textarea
              name="ingredients"
              id="ingredients"
              value={recipe.ingredients}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 sm:mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="instructions" className="block text-base sm:text-lg font-medium text-paragraph">
              Instructions (one per line)
            </label>
            <textarea
              name="instructions"
              id="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 sm:mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            ></textarea>
          </div>
          
          <div>
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
              className="mt-1 sm:mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen text-lg"
            />
          </div>
          
          <div>
            <label htmlFor="mealType" className="block text-base sm:text-lg font-medium text-paragraph">
              Meal Type
            </label>
            <select
              name="mealType"
              id="mealType"
              value={recipe.mealType}
              onChange={handleChange}
              required
              className="mt-1 sm:mt-2 p-2 block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-deepforestgreen"
            >
              <option value="">Select meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 sm:mt-6 px-4 py-2 w-full sm:w-auto bg-deepforestgreen text-white rounded hover:bg-cardtext focus:outline-none focus:ring-2 focus:ring-darkbrown transition-colors duration-200 btn-text"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;