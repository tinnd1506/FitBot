import React, { useState, useEffect } from 'react';

// AnimatedText component: Displays text with a typing animation effect
const AnimatedText = ({ text, interval = 100 }) => {
  // State to hold the currently displayed text
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    
    // Set up an interval to gradually reveal the text
    const intervalId = setInterval(() => {
      // Update the displayed text by slicing the input text
      setDisplayedText(text.slice(0, index));
      index++;
      
      // Clear the interval when the entire text has been revealed
      if (index > text.length) clearInterval(intervalId);
    }, interval);

    // Clean up the interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [text, interval]); // Re-run effect if text or interval changes

  // Render the animated text
  return <span>{displayedText}</span>;
};

export default AnimatedText;
