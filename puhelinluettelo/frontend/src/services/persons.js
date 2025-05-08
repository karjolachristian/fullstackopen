import axios from 'axios'
const urlBase = '/api/persons'

const getPersons = () =>{
  const req = axios.get(urlBase)
  return req.then(res => res.data)
}

const addPersons = ( data_upload ) => {
  const req = axios.post(urlBase, data_upload)
  return req.then(res => res.data)
}

const deletePerson = (id) => {
  const req = axios.delete(`${urlBase}/${id}`)
  return req.then(() => console.log(`Person with id ${id} is deleted`))
}

const updatePerson = (id, person) => {
  const req = axios.put(`${urlBase}/${id}`, person)
  return req.then(res => res.data)
} 

export { getPersons, addPersons, deletePerson, updatePerson }