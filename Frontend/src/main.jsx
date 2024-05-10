import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AulasABM from './componentes/aulas/aulas-abm.jsx'
import AulasForm from './componentes/aulas/aulas-form.jsx'
import MateriasABM from './componentes/materias/materias-abm.jsx'
import MateriasForm from './componentes/materias/materias-form.jsx'
import AsignacionesAB from './componentes/asignaciones-aulas-materias/asignaciones-ab.jsx'
import AsignacionesForm from './componentes/asignaciones-aulas-materias/asignaciones-from.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index={true} element={<AulasABM />} />
          <Route path='aulas' element={<AulasABM />} />
          <Route path='aulas/agregarAula' element={< AulasForm />} />
          <Route path='aulas/:id' element={< AulasForm />} />
          <Route path='materias' element={<MateriasABM />} />
          <Route path='materias/agregarMateria' element={<MateriasForm />} />
          <Route path='materias/:id' element={<MateriasForm />} />
          <Route path='asignaciones' element={<AsignacionesAB />} />
          <Route path='asignaciones/agregarAsignacion' element={<AsignacionesForm />} />
        </Route>

      </Routes>

    </BrowserRouter>
  </React.StrictMode>
)
