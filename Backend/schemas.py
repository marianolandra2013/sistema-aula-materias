

from pydantic import BaseModel, Field


class MateriaData(BaseModel):
    id: int 
    nombre : str
    carrera: str 

class AulaData(BaseModel):
    id: int
    nombre: str

class AsignacionesAulaMateriaData(BaseModel):
    id: int
    id_materia: int
    id_aula: int
    hora_inicio: int = Field(..., ge=7, le=22, description="hora de inicio debe estar entre 7 y 22")
    hora_fin: int = Field(..., ge=8, le=23, description="hora de fin debe estar entre 8 y 23")
    diaSemana: str

