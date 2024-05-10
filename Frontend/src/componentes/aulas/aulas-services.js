import axios from "axios";

const url = "http://localhost:5555/api"

export function get_aulas() {
    return axios.get(url + "/aulas");
}

export function agregar_aula(aulaNueva) {
    return axios.post(url + "/addAula", aulaNueva);

}

export function put_aula(aulaEditar) {
    return axios.put(url + "/putAula", aulaEditar);
}

export function delete_aula(id){
    return axios.delete(url+`/deleteAula/${id}`)
}

export function get_aula(id){
    return axios.get(url+`/getAula/${id}`);
}

