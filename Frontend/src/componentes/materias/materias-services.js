import axios from "axios";

const url = "http://localhost:5555/api"

export function get_materias() {
    return axios.get(url + "/materias");
}

export function agregar_materia(materiaNueva) {
    return axios.post(url + "/addMateria", materiaNueva );

}

export function put_materia(materiaEditar) {
    return axios.put(url + "/putMateria", materiaEditar);
}

export function delete_materia(id){
    return axios.delete(url+`/deleteMateria/${id}`)
}

export function get_materia(id){
    return axios.get(url+`/getMateria/${id}`);
}

