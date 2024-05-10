import { Outlet, NavLink } from "react-router-dom";
import logo from "./utnlogo.png";
import './App.css'

function App() {

  return (
    <>
      <nav className='navbar navbar-expand-lg bg-primary shadow-lg mb-5'>
        <div className='container'>
          <div className="collapse navbar-collapse">
          <div> <img src={logo}  alt="utn-logo" className="img-thumbnail img-utn"/></div>
            <ul className="navbar-nav ms-4">
              <li className="nav-item"> <NavLink to="aulas" className="nav-link text-light border border-light rounded">Gestion Aulas</NavLink></li>
              <li className="nav-item"> <NavLink to="materias" className="nav-link text-light border border-light ms-3 rounded">Gestion Materias</NavLink></li>
              <li className="nav-item"> <NavLink to="asignaciones" className="nav-link text-light border border-light ms-3 rounded">Gestion Asignaciones</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>     
      <Outlet />
    </>
  )
}

export default App
