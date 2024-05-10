import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { delete_materia, get_materias } from "./materias-services"

export default function MateriasABM() {

    const [materias, setMaterias] = useState([])
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        refrescarPagina();
    }, []);

    function refrescarPagina() {
        get_materias().then((resp) => {
            if (resp.status === 200) {
                setMaterias(resp.data);
            }
        }).catch(reason => setError(reason.response.data.detail));
    }

    function editarMateria(id) {
        navigate(`${id}`)
    }

    async function borrarMateria(id) {
        await delete_materia(id);
        refrescarPagina();
    }

    return (
        <>
            <div className="container text-center align-items-center justify-content-center bg-light rounded-4">
                <h1>Materias</h1>
                <table className="table table-sm table-secondary shadow-lg p-3 mb-4 table-hover table-bordered">
                    <thead>
                        <tr>
                            <th><h4>Nombre</h4></th>
                            <th><h4>Carrera</h4></th>
                            <th><h4>Accion</h4></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            materias.map((materia) => (
                                <tr key={materia.id}>
                                    <td><h5>{materia.nombre}</h5></td>
                                    <td><h5>{materia.carrera}</h5></td>
                                    <td><button className="btn btn-primary btn-sm" onClick={() => editarMateria(materia.id)}>Editar</button>
                                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => borrarMateria(materia.id)}>Borrar</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {error ? <div class="alert alert-danger"> <b>Error: {error}</b></div> : null}
                <button className="btn btn-outline-primary mb-4" onClick={() => navigate("agregarMateria")}>Agregar</button>
            </div>

        </>
    )
}