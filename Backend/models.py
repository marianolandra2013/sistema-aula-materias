
from sqlalchemy import Column, ForeignKey, Integer, SmallInteger, String, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Materias(Base):
    __tablename__ = 'materias'
    id= Column(Integer, primary_key=True, autoincrement=True)
    nombre= Column(String(90))
    carrera= Column(String(80))
    asignaciones= relationship("AsignacionesAulasMaterias", back_populates="materia", cascade="all, delete-orphan" )
    __table_args__ = (
        UniqueConstraint('nombre', 'carrera', name='materia_carrera_unique'),
    )

class Aulas(Base):
    __tablename__='aulas' 
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), unique=True)
    asignaciones= relationship("AsignacionesAulasMaterias", back_populates="aula", cascade="all, delete-orphan")




class AsignacionesAulasMaterias(Base):
    __tablename__='asignacionesAulasMaterias'
    id= Column(Integer, primary_key=True)
    id_materia = Column(Integer, ForeignKey(Materias.id))
    id_aula= Column(Integer, ForeignKey(Aulas.id))
    hora_inicio=Column(SmallInteger)
    hora_fin=Column(SmallInteger)
    diaSemana=Column(String(10))

    materia = relationship("Materias", back_populates="asignaciones")
    aula = relationship("Aulas", back_populates="asignaciones")

    