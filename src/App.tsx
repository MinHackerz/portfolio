import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DataEngineer from "./pages/DataEngineer";
import WebDeveloper from "./pages/WebDeveloper";
import DigitalMarketing from "./pages/DigitalMarketing";
import BackgroundElements from "./components/BackgroundElements";

const App = () => {
  return (
    <BrowserRouter>
      {/* Background Elements - more stable placement */}
      <BackgroundElements />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/data-engineer" element={<DataEngineer />} />
        <Route path="/web-developer" element={<WebDeveloper />} />
        <Route path="/digital-marketing" element={<DigitalMarketing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;