import Index from "./pages/Index"
import BackgroundElements from "./components/BackgroundElements"

const App = () => {
  return (
    <div className="relative min-h-screen">
      <BackgroundElements />
      <Index />
    </div>
  )
}

export default App