import { lazy, Suspense } from "react"
import Index from "./pages/Index"
import BackgroundElements from "./components/BackgroundElements"

const ShipRoute = lazy(() => import("./pages/ShipRoute"))

const App = () => {
  const path = window.location.pathname.replace(/\/+$/, "")
  if (path === "/ship-route") {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-[#05080c]" />}>
        <ShipRoute />
      </Suspense>
    )
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundElements />
      <Index />
    </div>
  )
}

export default App
