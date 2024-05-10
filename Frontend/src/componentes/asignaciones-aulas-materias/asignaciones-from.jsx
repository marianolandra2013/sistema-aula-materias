import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { get_aulas } from "../aulas/aulas-services";
import { get_materias } from "../materias/materias-services";
import { agregar_asignacion } from "./asignaciones-services";
export default function AsignacionesForm() {



    const [aulas, setAulas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [error, setError] = useState(null);

    let estadoInicial = { id: -1, id_materia: -1, id_aula: -1, hora_inicio: -1, hora_fin: -1, diaSemana: null };
    const [asignacion, setAsignacion] = useState(estadoInicial);

    const navegar = useNavigate()

    useEffect(() => {
        refrescarPagina();
        setError(null);
    }, []);


    async function refrescarPagina() {

        get_materias().then((resp) => {
            if (resp.status === 200) {
                setMaterias(resp.data);
            }
        }).catch(reason => setError(reason.response.data.detail));

        get_aulas().then((resp) => {
            if (resp.status === 200) {
                setAulas(resp.data);
            }
        })

    }


    function aceptar() {

        if (asignacion.id_aula > -1 && asignacion.id_materia > -1 && asignacion.diaSemana != '-1') {
            
            if (asignacion.hora_fin <= 23 && asignacion.hora_fin >= 8 && asignacion.hora_inicio <= 22 && asignacion.hora_inicio >= 7) {

                agregar_asignacion(asignacion).then((resp) => {

                    if (resp.status === 200) {
                        navegar(-1);
                    }
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status === 422) {
                            setError("Error al crear asignacion");
                        }
                        else if (error.response.status === 409) {
                            setError(error.response.data.detail);
                        }
                        else if (error.response.status === 400) {
                            setError(error.response.data.detail);
                        }
                    } else {
                        setError("Ocurrio un error al intentar guardar asignacion");
                    }
                });
            } else {
                setError("Hora de inicio y fin invalidas")
            }
        } else {
            setError("Campos incompletos")
        }

    }

    function handleEditChange(e) {
        setAsignacion({ ...asignacion, [e.target.id]: e.target.value })
    }


    return (
        <>
            <div className="container border rounded-4 shadow-lg">
                <h1 className="text-center">Datos de la Asignacion</h1>
                <div className="mb-2">
                    <label htmlFor="id_aula" className="form-label"> <b>Nombre de materia: </b></label>
                    <select className="form-select" aria-label="Default select example" id="id_materia" onChange={handleEditChange}>
                        <option value="-1">Seleccione una materia</option>
                        {materias.map((materia) => (
                            <option key={materia.id} value={materia.id}>{materia.nombre} - {materia.carrera}</option>
                        ))}
                    </select>

                </div>
                <div className="mb-2">
                    <label htmlFor="id_aula" className="form-label"> <b>Nombre de aula: </b></label>
                    <select className="form-select" aria-label="Default select example" id="id_aula" onChange={handleEditChange}>
                        <option value="-1">Seleccione un aula</option>
                        {aulas.map((aula) => (
                            <option key={aula.id} value={aula.id}>{aula.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label htmlFor="hora_inicio" className="form-label"> <b>Hora de inicio: </b></label>
                    <input className="ms-2" type="number" id="hora_inicio" min={7} max={22} onChange={handleEditChange} />
                </div>
                <div className="mb-2">
                    <label htmlFor="hora_fin" className="form-label"> <b>Hora de fin: </b></label>
                    <input className="ms-2" type="number" id="hora_fin" min={8} max={23} onChange={handleEditChange} />
                </div>
                <div className="mb-2">
                    <label htmlFor="diaSemana" className="form-label"> <b>Dia de la semana: </b></label>
                    <select id="diaSemana" className="form-select" aria-label="Default select example" onChange={handleEditChange} >
                        <option value="-1">Seleccione un día</option>
                        <option value="lunes">Lunes</option>
                        <option value="martes">Martes</option>
                        <option value="miercoles">Miercoles</option>
                        <option value="jueves">Jueves</option>
                        <option value="viernes">Viernes</option>
                    </select>
                </div>
                {error ? <div className="alert alert-danger"> <b> {error}</b></div> : null}
                <div className="mb-2 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={aceptar}>Aceptar</button>
                    <button className="btn btn-secondary ms-2" onClick={() => navegar(-1)}>Cancelar</button>
                </div>
            </div>
        </>
    )
}