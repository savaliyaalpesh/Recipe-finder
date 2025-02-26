import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

const image = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};



const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div className="text-center text-lg sm:text-xl mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-softcream">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex items-center p-4 border-b border-mutedgold">
        <h1 className="text-xl sm:text-2xl font-bold flex-1 text-deepforestgreen">{recipe.name}</h1>
        <button
          className="flex items-center justify-center gap-2 text-lg sm:text-xl font-semibold text-dustyrose"
          onClick={() => navigate(-1)}
        >
          {windowWidth < 375 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          ) : (
            <span className="flex items-center gap-1">
              <IoIosArrowRoundBack className="text-lg sm:text-xl" />
              Back
            </span>
          )}
        </button>

      </motion.div>

      <div className="container mx-auto px-2 sm:px-4 py-4">
        <motion.div
          className="flex justify-center mb-6"
          variants={image}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.img
            src={recipe.image}
            alt={recipe.name}
            className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg shadow-shadowred"
            variants={image}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </motion.div>

        <motion.p
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit" className="text-lg sm:text-xl mb-4 text-charcoalgray">
          Cooking Time: {recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes
        </motion.p>

        <div className="mb-6">
          <motion.div variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-muteddarkgreen text-lg font-semibold">
            <div className="py-1 border-b sm:border-b pb-2">
              <span className="font-semibold">Calories:</span> {recipe.caloriesPerServing}
            </div>
            <div className="py-1 border-b sm:border-b pb-2">
              <span className="font-semibold">Meal Type:</span> {recipe.mealType}
            </div>
            <div className="py-1 border-b sm:border-b pb-2">
              <span className="font-semibold">Category:</span> {Array.isArray(recipe.tags) ? recipe.tags.join(', ') : recipe.tags}
            </div>
            <div className="py-1 border-b sm:border-b pb-2">
              <span className="font-semibold">Origin:</span> {recipe.cuisine}
            </div>
          </motion.div>
        </div>

        {/* Ingredients Section with Animation */}
        <motion.div
          className="mb-6"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-darkbrown mb-4">
            Ingredients for {recipe.servings} servings
          </h2>

          <motion.ul className="list-disc pl-5 text-slategray space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <motion.li key={index} className="text-base sm:text-lg" variants={variants}>
                {ingredient}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Instructions Section */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit">
          <h2 className="text-xl sm:text-2xl font-bold text-darkbrown mb-4">
            Instructions for {recipe.servings} servings
          </h2>

          <motion.ol className="list-decimal pl-5 marker:text-cyan-900 text-slategray space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <motion.li key={index} className="text-base sm:text-lg" variants={variants}>{instruction}</motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </div>
    </div>
  );
};

export default RecipeDetail;