import { FC } from "react";

const BackgroundElements: FC = () => {
  return (
    <div 
      className="fixed inset-0 -z-10 transition-colors duration-200"
      aria-hidden="true"
    />
  );
};

export default BackgroundElements; 