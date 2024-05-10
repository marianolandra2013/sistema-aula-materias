import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { delete_aula, get_aulas } from "./aulas-services"

export default function AulasABM() {

    const [aulas, setAulas] = useState([])
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        refrescarPagina();
    }, []);

    function refrescarPagina() {
        get_aulas().then((resp) => {
            if (resp.status === 200) {
                setAulas(resp.data);
            } 
        }).catch(reason => setError(reason.response.data.detail));
    }

    function editarAula(id) {
        navigate(`/aulas/${id}`)
    }

    async function borrarAula(id) {
        await delete_aula(id);
        refrescarPagina();
    }

    return (
        <>
            <div className="container text-center align-items-center justify-content-center bg-light rounded-4">
                <h1>Aulas</h1>
                <table className="table table-sm table-secondary shadow-lg p-3 mb-4 table-hover table-bordered">
                    <thead>
                        <tr>
                            <th><h4>Nombre</h4></th>
                            <th><h4>Accion</h4></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            aulas.map((aula) => (
                                <tr key={aula.id}>
                                    <td><h5>{aula.nombre}</h5></td>
                                    <td><button className="btn btn-primary btn-sm" onClick={() => editarAula(aula.id)}>Editar</button>
                                    <button className="btn btn-secondary btn-sm ms-2" onClick={() => borrarAula(aula.id)}>Borrar</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <button className="btn btn-outline-primary mb-4" onClick={() => navigate("/aulas/agregarAula")}>Agregar</button>
                {error ? <div class="alert alert-danger"> <b>Error: {error}</b></div> : null}
            </div>
            
        </>
    )
}