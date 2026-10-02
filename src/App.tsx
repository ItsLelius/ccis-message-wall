import { useEffect } from "react"

import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"

import Home from "./pages/Home"
import Faculty from "./pages/Faculty"
import Person from "./pages/Person"
import Messages from "./pages/Messages"


const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    })
  }, [pathname])

  return null
}


function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/faculty"
          element={<Faculty />}
        />

        <Route
          path="/faculty/:slug"
          element={<Person />}
        />

        <Route
          path="/messages"
          element={<Messages />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App