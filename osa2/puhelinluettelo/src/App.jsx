import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import PersonsList from './components/PersonsList.jsx'
import { getPersons, addPersons, deletePerson, updatePerson } from './services/persons.jsx'
import Notification from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFilter, setPersonsFilter] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState({})

  useEffect(() => {
    getPersons().then(response => {
      setPersons(response)
      setPersonsFilter(response)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const elementFound = persons.find((element) => element.name == newName)
    if ( elementFound !== undefined) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, Do you want update information?`)
      if (confirmUpdate) {
        const personModify = {...elementFound, number: newNumber}
        updatePerson(elementFound.id, personModify)
        setMessage(`Changed number of ${elementFound.name}`)
        setNotificationStyle({color: 'green'})
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } else {
      const newId = persons.length+1
      const personToAdd = { name: newName, number: newNumber, id: String(newId)} 
      addPersons(personToAdd)
        .then(() => {
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${personToAdd.name}`)
          setNotificationStyle({color: 'green'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const inputName = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }
  const inputNumber = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }
  const inputFilter = (event) => {
    event.preventDefault()
    setPersonsFilter(persons.filter((el) => el.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const clickDelete = (person) => {
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      deletePerson(person.id)
        .then(() => {
          setMessage(`Deleted ${person.name}`)
          setNotificationStyle({color: 'red'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(() => {
          setMessage(`Information of '${person.name}' was already removed from server`)
          setNotificationStyle({color: 'red'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification styles={notificationStyle} message={message}/>
      <Filter onChangeHandle={inputFilter} />
      <h3>add a new</h3>
      <PersonForm submitForm={addPerson} nameValue={newName} nameHandle={inputName} numberValue={newNumber} numberHandle={inputNumber} />
      <h2>Numbers</h2>
      <PersonsList personArray={personsFilter} deleteHandle={clickDelete} />
    </div>
  )
}

export default App