import React, { useState } from 'react';
import image from '../../assets/luffy.webp'
import image1 from '../../assets/test.jpg'

const images = [
  image,
  image1
];

function SwipeGallery() {

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction) => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'right' && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    } else if (e.key === 'ArrowRight') {
      handleSwipe('right');
    }
  };

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  return (
    <div>
     
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={images[currentIndex]} alt={`Image ${currentIndex}`} style={{width:'100px',height:'100px'}}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => handleSwipe('left')}>Previous</button>
        <button onClick={() => handleSwipe('right')}>Next</button>
      </div>
    </div>
  );
}

export default SwipeGallery;