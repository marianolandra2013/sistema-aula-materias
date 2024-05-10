import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { agregar_materia, put_materia, get_materia } from "./materias-services";
export default function MateriasForm() {

    const params = useParams()

    let estadoInicial = { id: -1, nombre: "", carrera: "" };
    const [materia, setMateria] = useState(estadoInicial);
    const [error, setError] = useState(null);
    const navegar = useNavigate()


    useEffect(() => {
        if (params.id) {
            get_materia(params.id).then((resp) => {
                if (resp.status === 200) {
                    setMateria(resp.data);
                }
            }

            )
        }
    }, [params.id])
    function aceptar() {
        if (materia.nombre != "" && materia.carrera != "") {

            if (materia.id === -1) {

                agregar_materia(materia).then((resp) => {
                    if (resp.status === 200) {
                        navegar(-1);
                    }
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            setError(error.response.data.detail);
                        }
                    } else {
                        setError('Ocurrio un error al intentar guardar materia');
                    }
                });
            } else {
                put_materia(materia).then((resp) => {
                    if (resp.status === 200) {
                        navegar(-1);
                    }
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            setError(error.response.data.detail);
                        }
                    } else {
                        setError('Nombre de materia y/o carrera invalido');
                    }
                });
            }
        } else {
            setError("Campos de materia y/o carrera incompletos");
        }

    }

    function handleEditChange(e) {
        setMateria({ ...materia, [e.target.id]: e.target.value })
    }


    return (
        <>
            <div className="container border rounded-4 shadow-lg">
                <h1 className="text-center">Datos de Materia</h1>
                <div className="mb-2">
                    <label htmlFor="nombre" className="form-label"> <b>Nombre de materia: </b></label>
                    <input required type="text" className="form-control" id="nombre" value={materia.nombre} onChange={handleEditChange} maxLength="90"/>

                </div>
                <div className="mb-2">
                    <label htmlFor="nombre" className="form-label"> <b>Carrera: </b></label>
                    <input type="text" className="form-control" id="carrera" value={materia.carrera} onChange={handleEditChange} maxLength="80"/>
                </div>
                {error ? <div class="alert alert-danger"> <b>Error: {error}</b></div> : null}
                <div className="mb-2 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={aceptar}>Aceptar</button>
                    <button className="btn btn-secondary ms-2" onClick={() => navegar(-1)}>Cancelar</button>
                </div>
            </div>
        </>
    )
}