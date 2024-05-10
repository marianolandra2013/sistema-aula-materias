import axios from "axios";

const url = "http://localhost:5555/api"

export function get_asignaciones(id) {
    return axios.get(url + `/getAulasMateria/${id}`);
}

export function get_all_asignaciones() {
    return axios.get(url + `/getAllAulasMateria`);
}

export function agregar_asignacion(asignacionNueva) {
    return axios.post(url + "/asignarAula", asignacionNueva);
}

export function delete_asignacion(id){
    return axios.delete(url+`/desasignarAula/${id}`)
}