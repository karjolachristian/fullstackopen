import axios from 'axios'

export const urlBase = 'http://localhost:3001/persons'

export const getPersons = () =>{
  const request = axios.get(urlBase)
  return request.then(response => response.data)
}

export const addPersons = ( data_upload ) => {
  const request = axios.post(urlBase, data_upload)
  return request.then(response => response.data)
}

export const deletePerson = (id) => {
  const request = axios.delete(`${urlBase}/${id}`)
  return request.then(() => console.log(`Henkilö ${id} poistettu`))
}

export const updatePerson = (id, person) => {
  const request = axios.put(`${urlBase}/${id}`, person)
  return request.then(response => response.data)
}