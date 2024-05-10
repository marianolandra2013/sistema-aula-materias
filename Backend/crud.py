
from fastapi import HTTPException, status
from sqlalchemy import and_, column, or_, select
from sqlalchemy.orm import Session
from models import AsignacionesAulasMaterias, Aulas, Materias
from schemas import AsignacionesAulaMateriaData, AulaData, MateriaData


def save_materia(session: Session, materiaNueva:MateriaData):
    existeNombreMateria = session.query(Materias).filter(column("nombre").ilike(materiaNueva.nombre),
                                                         column("carrera").ilike(materiaNueva.carrera)).scalar()
    
    if(existeNombreMateria is None):
        db_materia = Materias(id = None, nombre=materiaNueva.nombre, carrera=materiaNueva.carrera) 
        session.add(db_materia)
        session.commit()
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="La materia ya existe en la carrera especificada")



def delete_materia(session: Session, idMateria:int):
    materiaDelete = session.execute(select(Materias).where(column("id") == idMateria)).scalar_one_or_none()
    if(materiaDelete):
        session.delete(materiaDelete)
        session.commit()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Materia no encontrada") 


def put_materia(session: Session, materiaDatosNuevos: MateriaData):
   
    existeNombreMateria = session.query(Materias).filter(column("nombre").ilike(materiaDatosNuevos.nombre), 
                                                         column("carrera").ilike(materiaDatosNuevos.carrera),
                                                         column("id") != materiaDatosNuevos.id).scalar()
    if(existeNombreMateria is None):
        materiaActualizar = session.execute(select(Materias).where(column("id")== materiaDatosNuevos.id)).scalar_one_or_none()
        if(materiaActualizar):
            materiaActualizar.nombre = materiaDatosNuevos.nombre
            materiaActualizar.carrera = materiaDatosNuevos.carrera
            session.commit()
            session.refresh(materiaActualizar)
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="La materia ya existe en la carrera especificada")   



def get_materia_by_id(session:Session, idMateriaBuscada: int):
    materiaRetornar = session.execute(select(Materias).where(column("id") == idMateriaBuscada)).scalar_one_or_none()
    if (materiaRetornar):
        return materiaRetornar
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Materia no encontrada")
    


def get_all_materias(session: Session):
    
    materiasDevolver = session.execute(select(Materias)).scalars()
    return materiasDevolver




def save_aula(session: Session, aulaNueva: AulaData):

    existeNombreAula = session.query(Aulas).filter(column("nombre").ilike(aulaNueva.nombre)).scalar()
    if(existeNombreAula is None):
        db_aula = Aulas(id = None, nombre= aulaNueva.nombre)
        session.add(db_aula)
        session.commit()
    else:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El aula ya existe")



def delete_aula(session: Session, idAulaBorrar: int):
    aulaBorrar = session.execute(select(Aulas).where(column("id")== idAulaBorrar)).scalar_one_or_none()
    if(aulaBorrar):
        session.delete(aulaBorrar)
        session.commit()



def put_aula(session: Session, aulaDatosNuevos: AulaData):

    existeNombreAula = session.query(Aulas).filter(column("nombre").ilike(aulaDatosNuevos.nombre),
                                                     column("id") != aulaDatosNuevos.id).scalar()
    
    if(existeNombreAula is None):
        aulaActualizar = session.execute(select(Aulas).where(column("id") == aulaDatosNuevos.id)).scalar_one_or_none()
        if(aulaActualizar):
            aulaActualizar.nombre = aulaDatosNuevos.nombre
            session.commit()
            session.refresh(aulaActualizar)
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El aula ya existe")
    


def get_aula_by_id(session:Session, idAulaBuscada: int):
    aulaRetornar = session.execute(select(Aulas).where(column("id") == idAulaBuscada)).scalar_one_or_none()
    if (aulaRetornar):
        return aulaRetornar
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aula no encontrada")
    


def get_all_aulas(session: Session):
    
    aulasDevolver = session.execute(select(Aulas)).scalars()
    return aulasDevolver



def asignar_aula_materia(session: Session, asignacion: AsignacionesAulaMateriaData):    
    
   
   
    if(asignacion.hora_inicio < asignacion.hora_fin):

        cantidad = session.query(AsignacionesAulasMaterias).filter(column("id_aula") == asignacion.id_aula,or_(
                                                                   and_(column("hora_inicio") <= asignacion.hora_inicio,
                                                                   column("hora_fin") > asignacion.hora_inicio),
                                                                   and_(column("hora_inicio") < asignacion.hora_fin,
                                                                   column("hora_fin") >= asignacion.hora_fin ),
                                                                   and_(column("hora_inicio").between(asignacion.hora_inicio, asignacion.hora_fin - 1)),
                                                                   and_(column("hora_fin").between(asignacion.hora_inicio +1 , asignacion.hora_fin ))),
                                                                   column("diaSemana").like(f"%{asignacion.diaSemana}%")).count()
        
        
        if(cantidad == 0):
            db_nueva_asignacion = AsignacionesAulasMaterias(id=None, 
                                             id_aula=asignacion.id_aula, 
                                             id_materia=asignacion.id_materia,
                                             hora_fin=asignacion.hora_fin,
                                             hora_inicio=asignacion.hora_inicio,
                                             diaSemana=asignacion.diaSemana)
            session.add(db_nueva_asignacion)
            session.commit()
        else:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Aula ocupada en ese horario y/o día")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Horas de inicio y fin invalidas")



def desasignar_aula_materia(session: Session, idAsignacion: int):
    asignacionEliminar = session.execute(select(AsignacionesAulasMaterias).where(column("id") == idAsignacion)).scalar_one_or_none()
    if(asignacionEliminar):
        session.delete(asignacionEliminar)
        session.commit()




def get_aulas_materia(session: Session, idMateria: int):
    materiaBuscada = session.execute(select(Materias).where(column("id") == idMateria)).scalar_one_or_none()
    if materiaBuscada:
        idMateriaBuscada = materiaBuscada.id
        asignaciones_materia = session.query(AsignacionesAulasMaterias, Aulas.nombre.label('nombre_aula')).join(Aulas).filter(column("id_materia") == idMateriaBuscada and
                                                                                           column("id_aula") == Aulas.id
                                                                                           ).all()
        asignaciones_materia_dict = [
                    {
                    'id': asignacion.id,
                    'diaSemana': asignacion.diaSemana,
                    'hora_inicio': asignacion.hora_inicio,
                    'hora_fin': asignacion.hora_fin,
                    'nombre_aula': nombre_aula
                }for asignacion, nombre_aula in asignaciones_materia
                ]        
        return asignaciones_materia_dict
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Materia no encontrada")

 
    
def get_all_aulas_materia(session: Session):
    
    asignaciones_materia = session.query(AsignacionesAulasMaterias, Aulas.nombre.label('nombre_aula')).join(Aulas).filter(column("id_aula") == Aulas.id).all()
    asignaciones_materia_dict = [
                {
                'id': asignacion.id,
                'diaSemana': asignacion.diaSemana,
                'hora_inicio': asignacion.hora_inicio,
                'hora_fin': asignacion.hora_fin,
                'nombre_aula': nombre_aula
            }for asignacion, nombre_aula in asignaciones_materia
            ]        
    return asignaciones_materia_dict
    