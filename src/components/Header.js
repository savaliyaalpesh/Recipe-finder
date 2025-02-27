import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import RecipeCard from "./RecipeCard"
import Pagination from "./Pagination"
import Slider from "./Slider"
import Logo from "../Img/logo.png"
import Carousel from "./Carousel" 

// Scroll animation component with overflow handling
const ScrollAnimatedItem = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: delay }
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };



  return (
    <div className="overflow-hidden">
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="exit"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Skeleton loader component for recipe cards
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-96 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="flex space-x-2 mt-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

const AnimatedIntro = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ times: [0, 0.3, 1], duration: 2 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#346b36]  z-50"
    >
      <motion.img
        src={Logo}
        alt="Logo"
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: [1, 1, 0.3],
          x: [0, 0, "-40vw"],
          y: [0, 0, "-40vh"],
          opacity: [0, 1, 0],
        }}
        transition={{ times: [0, 0.3, 1], duration: 2 }}
        onAnimationComplete={onComplete}
        className="relative"
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl font-bold text-white p-text"
        >
          COOK & EAT
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const InitialAnimation = ({ onComplete }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          backgroundColor: "#8db48e",
          color: "white",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "50vh",
          position: "absolute",
          top: 0,
        }}
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          backgroundColor: "#8db48e",
          color: "white",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "50vh",
          position: "absolute",
          bottom: 0,
        }}
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        onAnimationComplete={onComplete}
      />
    </div>
  )
}

const Header = () => {
  const [allRecipes, setAllRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("")
  const [sortOrder, setSortOrder] = useState("asc") // Now using setSortOrder
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [showHeader, setShowHeader] = useState(false)
  const [showFirstAnimation, setShowFirstAnimation] = useState(false)
  const [showSecondAnimation, setShowSecondAnimation] = useState(false)
  const [, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  // Added state for recipes from Home component
  const [, setRecipes] = useState([])
  const [, setLoading] = useState(true)

  // Check sessionStorage to determine if the page has been reloaded and to restore state
  const hasReloaded = sessionStorage.getItem("hasReloaded")

  // Initialize state from sessionStorage
  useEffect(() => {
    // Retrieve saved filter and pagination state
    const savedPage = sessionStorage.getItem("currentPage")
    const savedSearchQuery = sessionStorage.getItem("searchQuery")
    const savedSelectedTag = sessionStorage.getItem("selectedTag")
    const savedSelectedMeal = sessionStorage.getItem("selectedMeal")
    const savedSortOrder = sessionStorage.getItem("sortOrder")

    // Set state if values exist in storage
    if (savedPage) setCurrentPage(parseInt(savedPage))
    if (savedSearchQuery) setSearchQuery(savedSearchQuery)
    if (savedSelectedTag) setSelectedTag(savedSelectedTag)
    if (savedSelectedMeal) setSelectedMeal(savedSelectedMeal)
    if (savedSortOrder) setSortOrder(savedSortOrder)
  }, [])

  // Save current state to sessionStorage when state changes
  useEffect(() => {
    if (showHeader) { // Only save after the header is shown (animations completed)
      sessionStorage.setItem("currentPage", currentPage.toString())
      sessionStorage.setItem("searchQuery", searchQuery)
      sessionStorage.setItem("selectedTag", selectedTag)
      sessionStorage.setItem("selectedMeal", selectedMeal)
      sessionStorage.setItem("sortOrder", sortOrder)
    }
  }, [currentPage, searchQuery, selectedTag, selectedMeal, sortOrder, showHeader])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)
      if (!mobile) setIsMenuOpen(false)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleAnimationComplete = () => setShowHeader(true)

  useEffect(() => {
    if (!hasReloaded) {
      setShowFirstAnimation(true)
      setShowSecondAnimation(true)

      setTimeout(() => {
        setShowFirstAnimation(false)
        setShowSecondAnimation(false)
        setShowHeader(true)
        sessionStorage.setItem("hasReloaded", "true")
      }, 2000)
    } else {
      setShowHeader(true)
    }
  }, [hasReloaded])

  useEffect(() => {
    if (showHeader) {
      fetchAllRecipes()
      // Added fetchRecipes call
      fetchRecipes()
    }
  }, [showHeader])

  // Track URL changes to persist state between navigation
  useEffect(() => {
    // This effect will run when returning to the page
    // The state is already loaded from sessionStorage in the initialization effect
  }, [location.pathname])

  // Added fetchRecipes function from Home component
  const fetchRecipes = async () => {
    try {
      // Fetch from API
      const response = await fetch('https://dummyjson.com/recipes');
      const data = await response.json();
      
      // Get locally added recipes
      const localRecipes = JSON.parse(localStorage.getItem('addedRecipes') || '[]');
      
      // Combine API recipes with locally added ones
      setRecipes([...localRecipes, ...data.recipes]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

 const fetchAllRecipes = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('https://dummyjson.com/recipes?limit=1000');
        const data = await response.json();

        // Get locally added recipes
        const localRecipes = JSON.parse(localStorage.getItem('addedRecipes') || '[]');

        // Combine API recipes with locally added ones
        const combinedRecipes = [...localRecipes, ...data.recipes];
        setAllRecipes(combinedRecipes);
        setFilteredRecipes(combinedRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    } finally {
        setIsLoading(false);
    }
};


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle tag selection change
  const handleTagChange = (e) => {
    setSelectedTag(e.target.value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle meal type selection change
  const handleMealChange = (e) => {
    setSelectedMeal(e.target.value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle sort order change
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    setCurrentPage(1) // Reset to first page when sorting
  }

  const filterAndSortRecipes = useCallback(() => {
    let updatedRecipes = allRecipes ? [...allRecipes] : []

    if (searchQuery.trim() !== "") {
      updatedRecipes = updatedRecipes.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedTag) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.tags?.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()),
      )
    }

    if (selectedMeal) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        Array.isArray(recipe.mealType)
          ? recipe.mealType.some((meal) => meal.toLowerCase() === selectedMeal.toLowerCase())
          : recipe.mealType.toLowerCase() === selectedMeal.toLowerCase(),
      )
    }

    updatedRecipes.sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))

    setFilteredRecipes(updatedRecipes)
  }, [allRecipes, searchQuery, selectedTag, selectedMeal, sortOrder])

  // Update filtered recipes whenever search, tag, or meal type changes
  useEffect(() => {
    filterAndSortRecipes()
  }, [filterAndSortRecipes])

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + itemsPerPage)

  const isFiltered = searchQuery || selectedTag || selectedMeal

  // Check if we should show the slider and carousel (testimonials)
  // Show only when on page 1 AND no filters are applied
  const shouldShowSliderAndCarousel = currentPage === 1 && !isFiltered

  const MenuButton = () => (
    <button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="block lg:hidden z-50"
  aria-label="Toggle menu"
>
  <motion.div className="w-4 h-4 flex flex-col justify-between">
    <motion.span
      animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
      className="w-full h-0.5 bg-green-900 block origin-left"
    />
    <motion.span
      animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
      className="w-full h-0.5 bg-green-900 block"
    />
    <motion.span
      animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
      className="w-full h-0.5 bg-green-900 block origin-left"
    />
  </motion.div>
</button>

  )

  return (
    <>
      {showFirstAnimation && <AnimatedIntro onComplete={handleAnimationComplete} />}
      {showSecondAnimation && <InitialAnimation onComplete={handleAnimationComplete} />}

      {showHeader && (
        <>
          <header className="bg-[#8db48e] min-h-[100px] w-full fixed top-0 left-0 z-50 shadow-md">
            <div className="flex items-center justify-between px-4 md:px-14 py-4">
              <Link to="/" className="text-2xl font-bold text-green-400 flex-shrink-0">
                <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-16 w-28 object-cover" />
              </Link>

              <div className="flex items-center gap-4">
                <MenuButton />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-4 flex-1">
                  <div className="flex-1 flex items-center gap-4 justify-end">
                    <input
                      type="search"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-64 p-2 border rounded focus:outline-blue-700 btn-text"
                    />

                    <select value={selectedTag} onChange={handleTagChange} className="w-48 p-2 border rounded btn-text">
                      <option value="">All Tags</option>
                      {Array.from(new Set(allRecipes.flatMap((r) => r.tags))).map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>

                    <select value={selectedMeal} onChange={handleMealChange} className="w-48 p-2 border rounded btn-text">
                      <option value="">All Meal Types</option>
                      {Array.from(
                        new Set(allRecipes.flatMap((r) => (Array.isArray(r.mealType) ? r.mealType : [r.mealType]))),
                      ).map((meal) => (
                        <option key={meal} value={meal} >
                          {meal}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={toggleSortOrder}
                      className="bg-deepforestgreen hover:bg-heading text-white py-2 px-4 rounded-lg border border-deepforestgreen transition whitespace-nowrap flex-shrink-0 btn-text"
                    >
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          hover: { scale: 1.05, opacity: 0.9, transition: { duration: 0.3, ease: "easeOut" } },
                          tap: { scale: 0.95 }
                        }}
                        className="flex items-center"
                      >
                        <span>Sort: {sortOrder === "asc" ? "A-Z" : "Z-A"}</span>

                      </motion.div>
                    </button>

                    <Link
                      to="/add-recipe"
                      className="bg-deepforestgreen text-white py-2 px-4 rounded-lg hover:bg-green-700 transition whitespace-nowrap flex-shrink-0 ml-4 btn-text"
                    >
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          hover: { scale: 1.05, opacity: 0.9, transition: { duration: 0.3, ease: "easeOut" } },
                          tap: { scale: 0.95 }
                        }}>

                        Add Recipe
                      </motion.div>
                    </Link>

                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {/* Mobile Menu */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="lg:hidden bg-[#8db48e] px-4 pb-4"
    >
      <div className="flex flex-col gap-4">
        <input
          type="search"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)} // Allow normal search input
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsMenuOpen(false); // Close menu only on Enter key
          }}
          className="w-full p-2 border rounded focus:outline-blue-700"
        />

        <select
          value={selectedTag}
          onChange={(e) => {
            handleTagChange(e);
            setIsMenuOpen(false);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">All Tags</option>
          {Array.from(new Set(allRecipes.flatMap((r) => r.tags))).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          value={selectedMeal}
          onChange={(e) => {
            handleMealChange(e);
            setIsMenuOpen(false);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">All Meal Types</option>
          {Array.from(
            new Set(allRecipes.flatMap((r) => (Array.isArray(r.mealType) ? r.mealType : [r.mealType]))),
          ).map((meal) => (
            <option key={meal} value={meal}>
              {meal}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            toggleSortOrder();
            setIsMenuOpen(false);
          }}
          className="bg-deepforestgreen hover:bg-heading text-white py-2 px-4 rounded-lg border border-deepforestgreen transition whitespace-nowrap flex-shrink-0 btn-text"
        >
          <span>Sort: {sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
        </button>

        <Link
          to="/add-recipe"
          onClick={() => setIsMenuOpen(false)}
          className="lg:hidden bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition text-center"
        >
          Add Recipe
        </Link>
      </div>
    </motion.div>
  )}
</AnimatePresence>

          </header>

          <div className="mt-[100px]">
            {shouldShowSliderAndCarousel && (
              <div className="w-full overflow-hidden">
                <ScrollAnimatedItem direction="left">
                  <Slider />
                </ScrollAnimatedItem>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 lg:px-12 py-8">
                {[...Array(6)].map((_, index) => (
                  <ScrollAnimatedItem
                    key={index}
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 0.05}
                  >
                    <SkeletonCard />
                  </ScrollAnimatedItem>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 lg:px-12 py-8">
                {paginatedRecipes.map((recipe, index) => (
                  <ScrollAnimatedItem
                    key={recipe.id}
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 0.05}
                  >
                    <RecipeCard recipe={recipe} />
                  </ScrollAnimatedItem>
                ))}
              </div>
            )}

            {shouldShowSliderAndCarousel && (
              <div className="w-full overflow-hidden">
                <ScrollAnimatedItem direction="right">
                  <Carousel />
                </ScrollAnimatedItem>
              </div>
            )}

            <div className="my-8 w-full overflow-hidden">
              <ScrollAnimatedItem direction="left">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredRecipes.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </ScrollAnimatedItem>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header
