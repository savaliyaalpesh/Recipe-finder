import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RecipeSlider = () => {
  const [recipes, setRecipes] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  // const [servings, setServings] = useState();
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("https://dummyjson.com/recipes");
        const data = await response.json();

        const imageMap = {
          "Saag (Spinach) with Makki di Roti":
            "https://img.freepik.com/premium-photo/makki-di-roti-with-sarson-ka-saag-popular-punjabi-winter-recipe_641503-85518.jpg?w=740",
          "Tomato Basil Bruschetta":
            "https://img.taste.com.au/rcvJGXmk/taste/2016/11/tomato-and-basil-bruschetta-75254-1.jpeg",
          "Blueberry Banana Smoothie":
            "https://www.fyffes.com/wp-content/uploads/2021/08/LP-Banana-Pineapple-Blueberry-Smoothie-1536x760.jpg",
          "Classic Margherita Pizza":
            "https://images.unsplash.com/photo-1573821663912-569905455b1c?q=80&w=1374&auto=format&fit=crop",
        };

        const selectedRecipes = [
          "Saag (Spinach) with Makki di Roti",
          "Tomato Basil Bruschetta",
          "Blueberry Banana Smoothie",
          "Classic Margherita Pizza",
        ];

        const filteredRecipes = data.recipes
          .filter((recipe) => selectedRecipes.includes(recipe.name))
          .map((recipe) => ({
            ...recipe,
            image: imageMap[recipe.name] || recipe.image,
          }));

        setRecipes(filteredRecipes);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.params.navigation.prevEl = prevRef.current;
      swiperRef.current.swiper.params.navigation.nextEl = nextRef.current;
      swiperRef.current.swiper.navigation.init();
      swiperRef.current.swiper.navigation.update();
    }
  }, [recipes]);

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={0}
        slidesPerView={1}
        className="w-full h-full"
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.id} className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full bg-black/50"></div>
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />

            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
              className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-5 left-4 sm:left-8 md:left-12 lg:left-20 text-white p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-lg bg-white/10 rounded-lg shadow-lg max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]"
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold "
              >
                {recipe.name}
              </motion.h2>

              {!isMobile && (
                <>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3"
                  >
                    {Array.isArray(recipe.instructions)
                      ? recipe.instructions.join(" ").substring(0, 100)
                      : recipe.instructions
                        ? recipe.instructions.substring(0, 100)
                        : "No instructions available"}...
                  </motion.p>
                  <div className="mt-2 sm:mt-3 md:mt-4 flex items-center gap-2 sm:gap-3 md:gap-4">
                    <motion.span className="bg-green-500 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md text-sm sm:text-base">
                      {(recipe.caloriesPerServing * recipe.servings)} cal
                    </motion.span>

                    <motion.span className="bg-yellow-500 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md text-sm sm:text-base">
                      {recipe.cookTimeMinutes} min
                    </motion.span>
                  </div>
                </>
              )}

              <Link to={`/recipe/${recipe.id}`}>
                <motion.button className="mt-2 sm:mt-3 md:mt-4 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base text-white font-bold rounded-md shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all duration-300">
                  View Recipe
                </motion.button>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <motion.button
        ref={prevRef}
        className="absolute left-2 sm:left-3 md:left-4 lg:left-5 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg text-2xl sm:text-3xl md:text-4xl text-pink-600 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
      >
        <FaArrowLeft />
      </motion.button>
      <motion.button
        ref={nextRef}
        className="absolute right-2 sm:right-3 md:right-4 lg:right-5 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg text-2xl sm:text-3xl md:text-4xl text-pink-600 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
      >
        <FaArrowRight />
      </motion.button>
    </div>
  );
};

export default RecipeSlider;