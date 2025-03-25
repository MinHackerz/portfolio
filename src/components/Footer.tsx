import { FC } from "react";
import { Heart } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="mt-20 py-6 border-t border-gray-200 bg-glass/30 backdrop-blur-sm relative z-10">
      <div className="text-center text-sm text-gray-500">
        Designed and Crafted with <Heart className="inline-block w-4 h-4 text-red-500 mx-1" /> by Menajul Hoque
      </div>
    </footer>
  );
};

export default Footer; 