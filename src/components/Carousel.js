import { useRef, useState, useEffect,useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop",
    alt: "Profile photo of Nikos P.",
    content: "This Moussaka recipe is a must-try! The layers of eggplant, spiced meat, and creamy béchamel come together beautifully for an authentic Greek experience.",
    author: "Nikos P.",
  },
  {
    image:
      "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1470&auto=format&fit=crop",
    alt: "Profile photo of Arjun R.",
    content: "Perfectly crispy dosa with a deliciously spiced potato filling! Easy to follow recipe and pairs wonderfully with coconut chutney.",
    author: "Arjun R.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1595085610978-b5e35eb24dcf?q=80&w=1467&auto=format&fit=crop",
    alt: "Profile photo of Emma L.",
    content: "A classic Italian Pizza appetizer that's fresh, flavorful, and so easy to make!",
    author: "Emma L.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576248375753-3ea0f2153cd0?q=80&w=1470&auto=format&fit=crop",
    alt: "Profile photo of Luca M.",
    content: "This Margherita pizza recipe is so easy to follow and delivers restaurant-quality results!",
    author: "Luca M.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593237101928-6893fda30e05?q=80&w=1470&auto=format&fit=crop",
    alt: "Profile photo of Amira H.",
    content: "This falafel wrap recipe is quick, easy, and packed with flavor!",
    author: "Amira H.",
  },
];

const Carousel = () => {
  const sliderRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(3);
  const [itemWidth, setItemWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate the width of each item based on container width and visible items
  useEffect(() => {
    const calculateItemWidth = () => {
      const width = window.innerWidth;

      // Determine how many items to show based on screen width
      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }

      // Calculate item width if slider exists
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.clientWidth;
        const gap = 16; // gap between items in pixels
        const totalGapWidth = (visibleItems - 1) * gap;
        const calculatedWidth = (containerWidth - totalGapWidth) / visibleItems;
        setItemWidth(calculatedWidth);
        setIsInitialized(true);
      }
    };

    // Initial calculation
    calculateItemWidth();

    // Recalculate on window resize
    window.addEventListener('resize', calculateItemWidth);

    return () => {
      window.removeEventListener('resize', calculateItemWidth);
    };
  }, [visibleItems]);

  // Scroll functions defined outside the useEffect to avoid recreating them on every render
  const scrollLeft = () => {
    if (sliderRef.current) {
      const maxIndex = slides.length - visibleItems;
      // If at the first slide, loop to the last slide
      const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      const scrollPos = newIndex * (itemWidth + 16);
      sliderRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
      setCurrentIndex(newIndex);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollRight = useCallback(() => {
    if (sliderRef.current) {
      const maxIndex = slides.length - visibleItems;
      // If at the last slide, loop to the first slide
      const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      const scrollPos = newIndex * (itemWidth + 16);
      sliderRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
      setCurrentIndex(newIndex);
    }
  });

  // Auto-slide functionality with fixed dependencies
  useEffect(() => {
    // Only start auto-sliding after initialization
    if (!isInitialized || itemWidth === 0) return;
    
    let intervalId;
    
    if (!isPaused) {
      intervalId = setInterval(() => {
        scrollRight();
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, currentIndex, itemWidth, isInitialized, visibleItems, scrollRight]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Function to directly navigate to a specific slide
  const goToSlide = (index) => {
    if (sliderRef.current) {
      const scrollPos = index * (itemWidth + 16);
      sliderRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  // Reset the slider position when the window is resized or other dependencies change
  useEffect(() => {
    if (isInitialized && sliderRef.current) {
      const scrollPos = currentIndex * (itemWidth + 16);
      sliderRef.current.scrollTo({ left: scrollPos, behavior: "auto" });
    }
  }, [itemWidth, isInitialized, currentIndex]); 

  return (
    <div className="relative w-full max-w-screen-xl mx-auto py-8 px-4 mt-12">
      <div className="text-center mb-8 ">
        <span className="uppercase text-2xl tracking-wide text-charcoalgray p-4 font-semibold">See What our User have to say</span>
        <h1 className="text-4xl text-darkbluegray mt-4 uppercase -tracking-tighter">Testimonials</h1>
      </div>
      
      {/* Centered Navigation Buttons - using flex for perfect centering */}
      <div className="absolute bottom-52 left-0 flex items-center z-10">
        <button
          onClick={scrollLeft}
          className="bg-warmorange text-white p-2 rounded-full -top-2/4 shadow-md hover:bg-terracotta transition"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Testimonial Cards Container */}
      <div 
        className="relative mx-auto overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            // Hide scrollbar for Chrome, Safari, and Opera
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md"
              style={{
                width: itemWidth > 0 ? `${itemWidth}px` : `calc(100% / ${visibleItems})`,
                scrollSnapAlign: 'center'
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              {/* Profile Image */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 border-2 border-amber-300">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Testimonial Text */}
              <p className=" mb-4 max-w-xs mx-auto text-sm leading-relaxed text-mutedgreenishgray">
                "{slide.content}"
              </p>

              {/* Author Info */}
              <div className="mt-auto text-green-800">
                <p className="font-medium text-xl text-mutedgreenishgray">{slide.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Navigation Button with perfect centering */}
      <div className="absolute bottom-52 right-0 flex items-center z-10">
        <button
          onClick={scrollRight}
          className="bg-warmorange p-2 text-white rounded-full shadow-md hover:bg-terracotta transition"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: slides.length - visibleItems + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-warmorange" : "w-2 bg-warmorange"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;