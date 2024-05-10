
from crud import asignar_aula_materia, delete_aula, delete_materia, desasignar_aula_materia, get_all_aulas, get_all_aulas_materia, get_all_materias, get_aula_by_id, get_aulas_materia, get_materia_by_id, put_aula, put_materia, save_aula, save_materia
from schemas import AsignacionesAulaMateriaData, AulaData, MateriaData
import models 
from fastapi import Depends, FastAPI
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session


models.Base.metadata.create_all(engine)

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
    

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT"],  
    allow_headers=["*"],
)


@app.get("/")
def api():
    return "Bienvenido a api de Sistema de asignacion de aulas a materias"

#endpoints materias

@app.post("/api/addMateria")
def add_materia(data_materia: MateriaData, session: Session = Depends(get_session)):       
    save_materia(session,data_materia)
    
@app.delete("/api/deleteMateria/{idMateria}")
def borrar_materia(idMateria: int, session: Session = Depends(get_session)):
   materiaEliminada = delete_materia(session, idMateria) 
       
    
@app.put("/api/putMateria")
def modificar_materia(data_materia_mod: MateriaData, session: Session = Depends(get_session)):
    put_materia(session, data_materia_mod)

@app.get("/api/getMateria/{idMateria}", response_model=MateriaData)
def retornar_materia_by_id(idMateria: int, session: Session = Depends(get_session)):
    materia = get_materia_by_id(session, idMateria)
    return materia

@app.get("/api/materias", response_model=list[MateriaData])
def get_materias(session: Session = Depends(get_session)):
    materias = get_all_materias(session)
    return materias


#endpoints aulas

@app.post("/api/addAula")
def add_aula(data_aula: AulaData, session: Session = Depends(get_session)):
    save_aula(session, data_aula)

@app.delete("/api/deleteAula/{idAula}")
def borrar_aula(idAula:int, session: Session = Depends(get_session)):
    delete_aula(session, idAula)

@app.put("/api/putAula")
def modificar_aula(data_aula_mod: AulaData, session: Session = Depends(get_session)):
    put_aula(session, data_aula_mod)

@app.get("/api/getAula/{idAula}", response_model=AulaData)
def retornar_aula_by_id(idAula: int, session: Session = Depends(get_session)):
    aula = get_aula_by_id(session, idAula)
    return aula

@app.get("/api/aulas", response_model=list[AulaData])
def get_aulas(session: Session = Depends(get_session)):
    all_aulas = get_all_aulas(session)
    return all_aulas

#endpoints asignacioens

@app.post("/api/asignarAula")
def asignarAula(data_asignacion: AsignacionesAulaMateriaData, session: Session = Depends(get_session)):
    asignar_aula_materia(session, data_asignacion)
    
@app.delete("/api/desasignarAula/{idAsignacion}")
def desasignarAula(idAsignacion: int, session: Session = Depends(get_session)):
    desasignar_aula_materia(session, idAsignacion)

@app.get("/api/getAulasMateria/{idMateria}")
def get_asignaciones(idMateria: int, session: Session = Depends(get_session)):
    asignaciones = get_aulas_materia(session, idMateria)
    return asignaciones

@app.get("/api/getAllAulasMateria")
def get_all_asignaciones(session: Session = Depends(get_session)):
    asignaciones = get_all_aulas_materia(session)
    return asignaciones

