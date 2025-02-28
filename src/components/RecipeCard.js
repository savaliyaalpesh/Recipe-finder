import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiClock, FiEdit } from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import { FaFire, FaUtensils, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

// Skeleton loader component
const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-xs mx-auto mt-24 h-[400px] flex flex-col animate-pulse">
      {/* Image Container */}
      <div className="relative flex justify-center -mt-20 sm:-mt-24">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 border-4 border-white shadow-lg" />
      </div>

      {/* Recipe Info */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 bg-gray-200 rounded mt-3 sm:mt-4 mx-auto w-3/4"></div>

        {/* Details (Time & Calories) */}
        <div className="flex flex-col space-y-2 items-center justify-center mb-4 mt-4">
          <div className="flex items-center gap-2 w-3/4">
            <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="flex items-center gap-2 w-3/4">
            <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="flex items-center gap-2 w-3/4">
            <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>

        <div className="w-full h-10 bg-gray-200 rounded mt-16"></div>
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe, loading }) => {
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  if (loading) {
    return <RecipeCardSkeleton />;
  }

  // Check if recipe is new (added within the last 3 days)
  const isNewRecipe = () => {
    // Check if recipe has the isNew flag
    if (recipe.isNew) return true;

    // Or check if recipe was created within the last 3 days
    if (recipe.createdAt) {
      const createdDate = new Date(recipe.createdAt);
      const currentDate = new Date();
      // Calculate difference in days
      const diffTime = currentDate - createdDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3; // Display "New" badge for recipes added in the last 3 days
    }

    return false;
  };

  // Check if this is a user-added recipe
  const isUserAddedRecipe = () => {
    // We can identify user-added recipes because they have the createdAt field
    // (From the AddRecipe component, all user-added recipes have this field)
    return !!recipe.createdAt;
  };

  // Handle edit button click
  const handleEdit = () => {
    navigate(`/edit-recipe/${recipe.id}`, { state: { recipe } });
  };

  // Handle delete button click
  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    try {
      // Get all recipes from localStorage
      const allRecipes = JSON.parse(localStorage.getItem('addedRecipes') || '[]');
      
      // Filter out the recipe to delete
      const updatedRecipes = allRecipes.filter(item => item.id !== recipe.id);
      
      // Save the updated list back to localStorage
      localStorage.setItem('addedRecipes', JSON.stringify(updatedRecipes));
      
      // Show success message
      setShowDeleteConfirmation(false);
      setNotification({
        show: true,
        message: "Recipe deleted successfully!",
        type: "success"
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        // Force a refresh to update the UI
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setShowDeleteConfirmation(false);
      setNotification({
        show: true,
        message: "Error deleting recipe. Please try again.",
        type: "error"
      });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-xs mx-auto mt-24 h-[400px] flex flex-col group transition-transform duration-300 hover:shadow-xl relative">
      {/* Notification */}
      {notification.show && (
        <div className={`absolute top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === "success" ? "bg-deepforestgreen text-white" : "bg-red-600 text-white"
        }`}>
          {notification.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <p className="text-sm">{notification.message}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full">
            <h3 className="text-lg font-semibold text-darkbluegray mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative flex justify-center -mt-20 sm:-mt-24 transition-transform duration-300 group-hover:scale-110">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.name}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg shadow-red-700"
        />

        {/* New Badge positioned on top of the image */}
        {isNewRecipe() && (
          <span className="absolute top-4 right-3 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-lg shadow-md animate-bounce flex items-center gap-1 tracking-widest">
            <FaUtensils className="w-4 h-4" />
            New
          </span>
        )}
      </div>

      {/* Recipe Info */}
      <div className=" flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl mt-3 sm:mt-4 line-clamp-2 text-center h-14 flex items-center justify-center btn-text text-darkbluegray font-bold ">
          {recipe.name}
          {/* Alternative position for New badge - next to title */}
          {/* {isNewRecipe() && (
            <span className='bg-emerald-50 text-emerald-600 text-xs font-medium ml-2 px-1.5 rounded py-1'>
              New
            </span>
          )} */}
        </h3>

        {/* Details (Time & Calories) */}
        <div className="flex flex-col space-y-2 items-center justify-center  mb-4 mt-4">
          <div className="flex items-center gap-2 text-darkgray">
            <FiClock className=" text-lg sm:text-xl" />
            <p className="text-sm sm:text-base">
              Prep: <span>{recipe.prepTimeMinutes}</span> mins
            </p>
          </div>

          <div className="flex items-center gap-2 text-darkgray">
            <GiCookingPot className=" text-xl sm:text-2xl" />
            <p className="text-sm sm:text-base">
              Cook: <span>{recipe.cookTimeMinutes}</span> mins
            </p>
          </div>

          <div className="flex items-center gap-2 text-darkgray">
            <FaFire className=" text-lg sm:text-xl" />
            <p className="text-sm sm:text-base">
              <span>{recipe.caloriesPerServing}</span> cal/serving
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link to={`/recipe/${recipe.id}`} className="block w-full font-medium px-4 py-2 rounded transition-colors duration-200 text-center text-sm sm:text-base btn-text bg-white hover:bg-slightlydarkergreen text-darkbluegray border border-muteddarkgreen"
          >
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { x: [0, -3, 3, -3, 3, 0], transition: { duration: 0.4 } },
                tap: { scale: 0.95 }
              }}
            >
              View Recipe
            </motion.div>
          </Link>
          
          {/* Edit and Delete buttons for user-added recipes - now below View Recipe button */}
          {isUserAddedRecipe() && (
            <div className="flex justify-between gap-2 mt-2">
              <button
                onClick={handleEdit}
                className="flex-1 bg-deepforestgreen text-white py-2 px-4 rounded transition-colors duration-200 hover:bg-slightlydarkergreen flex items-center justify-center gap-1"
                title="Edit Recipe"
              >
                <FiEdit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200 hover:bg-red-700 flex items-center justify-center gap-1"
                title="Delete Recipe"
              >
                <FaTrash className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;