import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  return (

    <BrowserRouter>
      <Routes >
        <Route index Component={Home} />
        <Route path='/projects/:slug' Component={ProjectDetails} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
