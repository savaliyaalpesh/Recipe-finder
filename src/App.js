import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import RecipeDetail from "./components/RecipeDetail.js"
import AddRecipe from "./components/AddRecipe"
import EditRecipe from './components/EditRecipe.js';

function App() {
  return (
    <Router>
      <div className='bg-[#8db48e]'>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/recipe/:id" element={<RecipeDetail/>} />
          <Route path="/add-recipe/" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

