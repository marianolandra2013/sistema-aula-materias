import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { agregar_aula, get_aula, put_aula } from "./aulas-services";
export default function AulasForm() {

    const params = useParams()

    let estadoInicial = { id: -1, nombre: "" };
    const [aula, setAula] = useState(estadoInicial);
    const [error, setError] = useState(null);
    const navegar = useNavigate()


    useEffect(() => {
        if (params.id) {
            get_aula(params.id).then((resp) => {
                if (resp.status === 200) {
                    setAula(resp.data);
                }
            }

            )
        }
    }, [params.id])


    function aceptar() {

        if (aula.nombre != "") {
            if (aula.id === -1) {

                agregar_aula(aula).then((resp) => {

                    if (resp.status === 200) {
                        navegar(-1);
                    }
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            setError(error.response.data.detail);
                        }
                    } else {
                        setError('Ocurrio un error al intentar guardar aula');
                    }
                });
            } else {
                put_aula(aula).then((resp) => {
                    if (resp.status === 200) {
                        navegar(-1);
                    }
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            setError(error.response.data.detail);
                        }
                    } else {
                        setError('Nombre de aula invalido');
                    }
                });
            }
        } else {
            setError("Campo nombre incompleto")
        }

    }

    function handleEditChange(e) {
        setAula({ ...aula, [e.target.id]: e.target.value })
    }


    return (
        <>
            <div className="container border rounded-4 shadow-lg">
                <h1 className="text-center">Datos de Aula</h1>
                <div className="mb-2">
                    <label htmlFor="nombre" className="form-label"> <b>Nombre de aula: </b></label>
                    <input type="text" className="form-control" id="nombre" value={aula.nombre} onChange={handleEditChange} maxLength="80" />

                </div>
                {error ? <div className="alert alert-danger"> <b>Error: {error}</b></div> : null}
                <div className="mb-2 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={aceptar}>Aceptar</button>
                    <button className="btn btn-secondary ms-2" onClick={() => navegar(-1)}>Cancelar</button>
                </div>
            </div>
        </>
    )
}