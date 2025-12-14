import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import NavBar from "./components/NavBar"
import Hero from "./components/Hero"
import Cocktaills from "./components/Cocktaills"
import About from "./components/About"
import Art from "./components/Art"
import Menu from "./components/Menu"
import Contact from "./components/Contact"

gsap.registerPlugin(ScrollTrigger, SplitText)

const App = () => {
  return (
    <main>
      <NavBar />
      <Hero />
      <Cocktaills />
      <About />
      <Art />
      <Menu />
      <Contact />
    </main>
  )
}

export default App