/**
 * Debounces a function call.
 * @param {function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {function} A debounced version of the function.
 */
export function debounce(func, delay) {
    let timeoutId = null;
  
    return function (...args) {
      const context = this;
  
      if (timeoutId !== null) {
        clearTimeout(timeoutId);    
      }
  
      timeoutId = setTimeout(() => {
        func.apply(context, args);
        timeoutId = null;
      }, delay);
    };
  }