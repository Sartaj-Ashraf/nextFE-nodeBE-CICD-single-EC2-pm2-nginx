import React, { memo } from "react";
const NoMoreContentToLoad = memo(({ textToDisplay }) => (
  <div className="text-center">
    <p className="text-gray-500 font-serif italic">{textToDisplay}</p>
    <div className="mx-auto w-16 h-px bg-gray-300"></div>
  </div>
));

export default NoMoreContentToLoad;
