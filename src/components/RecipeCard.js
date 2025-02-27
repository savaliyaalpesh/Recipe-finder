import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import { FaFire,FaUtensils} from "react-icons/fa";
import { motion } from "framer-motion";

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

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-xs mx-auto mt-24 h-[400px] flex flex-col group transition-transform duration-300 hover:shadow-xl">
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

        <Link to={`/recipe/${recipe.id}`} className="block w-full mt-16 font-medium px-4 py-2 rounded transition-colors duration-200 text-center text-sm sm:text-base btn-text bg-white hover:bg-slightlydarkergreen text-darkbluegray border border-muteddarkgreen"
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
      </div>
    </div>
  );
};

export default RecipeCard;