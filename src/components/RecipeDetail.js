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

// Skeleton component for loading state
const RecipeSkeleton = () => {
  return (
    <div className="min-h-screen bg-softcream animate-pulse">
      <div className="flex items-center p-4 border-b border-mutedgold">
        <div className="h-8 bg-skeleton rounded w-3/4"></div>
        <div className="h-8 bg-skeleton rounded w-16 ml-auto"></div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md h-64 bg-skeleton rounded-lg shadow-lg"></div>
        </div>

        <div className="h-6 bg-skeleton rounded w-1/2 mb-4"></div>

        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="py-1 border-b border-shadowred sm:border-b pb-2">
                <div className="h-6 bg-skeleton rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="h-8 bg-skeleton rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-skeleton rounded w-full"></div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-8 bg-skeleton rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 bg-skeleton rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to process text arrays and remove empty entries
const processTextArray = (data) => {
  if (Array.isArray(data)) {
    return data
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  if (typeof data === 'string') {
    return data
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  return [];
};

// Helper function to process comma-separated tags
const processTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
  return [];
};

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserAdded, setIsUserAdded] = useState(false);
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
      setLoading(true);
      try {
        // First check if this is a locally added recipe
        const addedRecipes = JSON.parse(localStorage.getItem('addedRecipes') || '[]');
        const localRecipe = addedRecipes.find(recipe => recipe.id.toString() === id.toString());
        
        if (localRecipe) {
          // Process local recipe to ensure data format is consistent
          setIsUserAdded(true);
          setRecipe({
            ...localRecipe,
            name: localRecipe.name.trim(),
            ingredients: processTextArray(localRecipe.ingredients),
            instructions: processTextArray(localRecipe.instructions),
            tags: processTags(localRecipe.tags),
            cuisine: localRecipe.cuisine ? localRecipe.cuisine.trim() : 'Not specified',
            servings: localRecipe.servings || 4
          });
        } else {
          // If not in localStorage, fetch from API
          setIsUserAdded(false);
          const response = await fetch(`https://dummyjson.com/recipes/${id}`);
          const data = await response.json();
          
          // Process API data to ensure consistency and remove blank spaces
          setRecipe({
            ...data,
            ingredients: processTextArray(data.ingredients),
            instructions: processTextArray(data.instructions),
            tags: processTags(data.tags)
          });
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return <RecipeSkeleton />;
  }

  if (!recipe) {
    return <div className="text-center text-lg sm:text-xl mt-10">Recipe not found</div>;
  }

  // Format tags for display
  const formattedTags = Array.isArray(recipe.tags) && recipe.tags.length > 0 
    ? recipe.tags.join(', ') 
    : 'None';

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
          Cooking Time: {(parseInt(recipe.prepTimeMinutes) || 0) + (parseInt(recipe.cookTimeMinutes) || 0)} minutes
        </motion.p>

        <div className="mb-6">
          <motion.div 
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit" 
            className={`grid grid-cols-1 sm:grid-cols-2 ${isUserAdded ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-x-4 gap-y-2 text-muteddarkgreen text-lg font-semibold`}>
            <div className="py-1 border-b border-shadowred sm:border-b pb-2">
              <span className="font-semibold">Calories:</span> {recipe.caloriesPerServing || 'Not specified'}
            </div>
            <div className="py-1 border-b border-shadowred sm:border-b pb-2">
              <span className="font-semibold">Meal Type:</span> {recipe.mealType || 'Not specified'}
            </div>
            <div className="py-1 border-b border-shadowred sm:border-b pb-2">
              <span className="font-semibold">Category:</span> {formattedTags}
            </div>
            {!isUserAdded && (
              <div className="py-1 border-b border-shadowred sm:border-b pb-2">
                <span className="font-semibold">Origin:</span> {recipe.cuisine || 'Not specified'}
              </div>
            )}
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
            Ingredients for {recipe.servings || 4} servings
          </h2>

          <motion.ul className="list-disc pl-5 text-slategray space-y-2">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <motion.li key={index} className="text-base sm:text-lg" variants={variants}>
                  {ingredient}
                </motion.li>
              ))
            ) : (
              <motion.li className="text-base sm:text-lg" variants={variants}>
                No ingredients specified
              </motion.li>
            )}
          </motion.ul>
        </motion.div>

        {/* Instructions Section */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit">
          <h2 className="text-xl sm:text-2xl font-bold text-darkbrown mb-4">
            Instructions
          </h2>

          <motion.ol className="list-decimal pl-5 marker:text-cyan-900 text-slategray space-y-3">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <motion.li key={index} className="text-base sm:text-lg" variants={variants}>
                  {instruction}
                </motion.li>
              ))
            ) : (
              <motion.li className="text-base sm:text-lg" variants={variants}>
                No instructions specified
              </motion.li>
            )}
          </motion.ol>
        </motion.div>
      </div>
    </div>
  );
};

export default RecipeDetail;