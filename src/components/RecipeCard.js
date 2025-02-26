import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion"


const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-xs mx-auto mt-24 h-[400px] flex flex-col group transition-transform duration-300 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative flex justify-center -mt-20 sm:-mt-24 transition-transform duration-300 group-hover:scale-110">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.name}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg shadow-red-700"
        />
      </div>

      {/* Recipe Info */}
      <div className=" flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl mt-3 sm:mt-4 line-clamp-2 text-center h-14 flex items-center justify-center btn-text text-darkbluegray font-bold ">
          {recipe.name}
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
            // variants={{
            //   hover: { boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.5)", scale: 1.05, transition: { duration: 0.3 } },
            //   tap: { scale: 0.95 }
            // }}
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