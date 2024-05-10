import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { delete_asignacion, get_all_asignaciones, get_asignaciones } from "./asignaciones-services";
import { get_materias } from "../materias/materias-services";

export default function AsignacionesAB() {


    const [asignaciones, setAsignaciones] = useState([]);

    const [materias, setMaterias] = useState([]);
    const [materiaSelect, setMateriaSelect] = useState();
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        refrescarPagina();
        setError(null);

    }, []);

    function allAsignaciones() {
        get_all_asignaciones().then((resp) => {
            if (resp.status === 200) {
                setAsignaciones(resp.data);
            }
        }).catch(reason => setError(reason.response.data.detail));
       

    }

    function refrescarPagina() {

        get_materias().then((resp) => {
            if (resp.status === 200) {
                setMaterias(resp.data);
                setMateriaSelect(resp.data[0].id);

            }
        }).catch(reason => setError(reason.response.data.detail));

    }

    function handleSelectChange(e) {
        setMateriaSelect(e.target.value);
    }

    function filtrarAsignaciones() {

        get_asignaciones(materiaSelect).then((resp) => {
            if (resp.status === 200) {
                setAsignaciones(resp.data);
            }
        }).catch(reason => setError(reason.response.data.detail));

    }

    async function borrarAsignacion(id) {
        await delete_asignacion(id);
        filtrarAsignaciones();
    }

    return (
        <>
            <div className="container text-center align-items-center justify-content-center bg-light rounded-4">
                <h1 className="mb-3">Asignaciones</h1>
                <h5 className="mb-1 text-start">Seleccione una materia:</h5>
                <div className="d-flex mb-3">
                    <select className="form-select" aria-label="Default select example" onChange={handleSelectChange} disabled={materias.length === 0} defaultValue={materiaSelect} >
                        {materias.map((materia) => (
                            <option key={materia.id} value={materia.id}>{materia.nombre} - {materia.carrera} </option>
                        ))}
                    </select>
                    <button className="btn btn-outline-primary ms-2" onClick={filtrarAsignaciones} disabled={materias.length === 0}>Filtrar</button>
                    <button className="btn btn-outline-primary ms-2 w-25" onClick={allAsignaciones} disabled={materias.length === 0}>Todas las asignaciones</button>
                </div>

                {error ? <div class="alert alert-danger"><b>Error: {error}</b></div> : null}

                <table className="table table-sm table-secondary shadow-lg p-3 mb-4 table-hover table-bordered">
                    <thead>
                        <tr>
                            <th><h4>Informacion</h4></th>
                            <th><h4>Accion</h4></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            asignaciones.map((asignacion) => (
                                <tr key={asignacion.id}>
                                    <td><h5>{asignacion.nombre_aula}, el día {asignacion.diaSemana}, de {asignacion.hora_inicio}hs a {asignacion.hora_fin}hs </h5></td>
                                    <td><button className="btn btn-secondary btn-sm" onClick={() => borrarAsignacion(asignacion.id)}>Borrar</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <button className="btn btn-outline-primary mb-4" onClick={() => navigate("agregarAsignacion")}>Agregar</button>
            </div>
        </>
    )
}