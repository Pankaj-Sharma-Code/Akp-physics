// import { useState, useEffect } from 'react';

// const Sliding = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);
  
//   const images = [
//     "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/538998c0-7d3d-4717-bb2d-5feaf93da19a.webp",
//     "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/ab047600-3d55-4a4e-ae28-25c91a594ab2.webp",
//     "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/10ca6caa-66ed-4eea-87a9-1f1c1844a84d.webp",
//     "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/ab047600-3d55-4a4e-ae28-25c91a594ab2.webp",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000);
//     setIntervalId(interval);

//     // Cleanup interval on component unmount or when interval changes
//     return () => clearInterval(interval);
//   }, [images.length]);

//   const goToNext = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
//     resetInterval(); // Reset the interval after manual navigation
//   };

//   const goToPrev = () => {
//     setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//     resetInterval(); // Reset the interval after manual navigation
//   };

//   const resetInterval = () => {
//     if (intervalId) {
//       clearInterval(intervalId); // Clear the current interval
//     }
//     const newInterval = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000); // Set a new interval
//     setIntervalId(newInterval); // Store the new interval ID
//   };

//   return (
//     <>
//       <div className="relative w-full overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{
//             transform: `translateX(-${activeIndex * 100}%)`,
//           }}
//         >
//           {images.map((src, index) => (
//             <div key={index} className="w-full flex-shrink-0">
//               <img src={src} className="w-full" alt={`carousel-item-${index}`} />
//             </div>
//           ))}
//         </div>

//         {/* Left and Right Navigation Buttons */}
//         <button
//           onClick={goToPrev}
//           className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
//           style={{ zIndex: 10 }}
//         >
//           &#60;
//         </button>
//         <button
//           onClick={goToNext}
//           className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
//           style={{ zIndex: 10 }}
//         >
//           &#62;
//         </button>
//       </div>

//       <div className="flex w-full justify-center gap-2 py-2">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveIndex(index)}
//             className={`btn-ghost btn-circle ${index === activeIndex ? 'bg-blue-500' : 'bg-white'}`}
//             style={{ width: '5px', height: '5px' }}
//           ></button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Sliding;
























import { useState, useEffect } from 'react';

const Sliding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [images, setImages] = useState([]);

  const largeScreenImages = [
    "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/538998c0-7d3d-4717-bb2d-5feaf93da19a.webp",
    "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/ab047600-3d55-4a4e-ae28-25c91a594ab2.webp",
    "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/10ca6caa-66ed-4eea-87a9-1f1c1844a84d.webp",
    "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/ab047600-3d55-4a4e-ae28-25c91a594ab2.webp",
  ];

  const smallScreenImages = [
    "https://i.ibb.co/DC5NTpV/Untitled-design.png",
    "https://i.ibb.co/5YkGf4N/Untitled-design-1.png",
    "https://i.ibb.co/FwD5L74/Untitled-design-2.png",
    "https://i.ibb.co/5YkGf4N/Untitled-design-1.png",
  ];

  useEffect(() => {
    const updateImages = () => {
      if (window.innerWidth < 768) {
        setImages(smallScreenImages);
      } else {
        setImages(largeScreenImages);
      }
    };

    // Set the images initially based on the screen size
    updateImages();

    // Update images on window resize
    window.addEventListener("resize", updateImages);

    return () => {
      window.removeEventListener("resize", updateImages);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [images]);

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetInterval();
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const newInterval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    setIntervalId(newInterval);
  };

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img src={src} className="w-full" alt={`carousel-item-${index}`} />
            </div>
          ))}
        </div>

        {/* Left and Right Navigation Buttons */}
        <button
          onClick={goToPrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          style={{ zIndex: 10 }}
        >
          &#60;
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          style={{ zIndex: 10 }}
        >
          &#62;
        </button>
      </div>

      <div className="flex w-full justify-center gap-2 py-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`btn-ghost btn-circle ${index === activeIndex ? 'bg-blue-500' : 'bg-white'}`}
            style={{ width: '5px', height: '5px' }}
          ></button>
        ))}
      </div>
    </>
  );
};

export default Sliding;
