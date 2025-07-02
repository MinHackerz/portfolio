import Index from "./pages/Index";
import BackgroundElements from "./components/BackgroundElements";

const App = () => {
  return (
    <div>
      {/* Keep minimal background elements */}
      <BackgroundElements />
      <Index />
    </div>
  );
};

export default App;