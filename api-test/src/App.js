import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const initialFormValues = {
  name: "",
  bio: ""
}

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [editId, setEditId] = useState('');

  const onInputChange = e => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  const deleteUser = id => {
    axios.delete(`http://localhost:8000/api/users/${id}`)
      .then(res => {
        setUsers(users.filter(user => user.id !== id))
      })
  }

  const addUser = e => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/users', formValues)
      .then(res => {
        setUsers([
          ...users,
          res.data
        ]);
        setError('');
        setFormValues(initialFormValues);
      })
      .catch(err => {
        console.log(err.response);
        setError(err.response.data.errorMessage);
      })
  }

  const editUser = e => {
    e.preventDefault();
    const editedUser = {
      id: editId,
      ...formValues
    }

    axios.put(`http://localhost:8000/api/users/${editId}`, formValues)
      .then(res => {
        setUsers(users.map(user => {
          if (user.id === editId) {
            return res.data.user;
          }else {
            return user
          }
        }))
        setError('');
        setIsEditing(false);
        setEditId('');
        setFormValues(initialFormValues);
      })
      .catch(err => {
        setError(err.response.data.errorMessage)
      })
  }

  const openEdit = user => {
    setIsEditing(true);
    setEditId(user.id);
    setError('');
    setFormValues({ name: user.name, bio: user.bio });
  }

  const closeEdit = () => {
    setIsEditing(false);
    setEditId('');
    setError('');
    setFormValues(initialFormValues);
  } 

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:8000/api/users')
      .then(res => {
        console.log(res);
        setIsLoading(false);
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])
  
  return (
    <div className="App">
      <h1>Users</h1>
      {isLoading && <h2>Loading...</h2>}
      <div className='user-list'>
        {users.map(user => {
          return (
            <div key={user.id} className='user'>
              <p>Name: {user.name}</p>
              <p>Bio: {user.bio}</p>
              <button onClick={() => openEdit(user)}>Edit</button>&nbsp;
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          )
        })}
      </div>
      <form onSubmit={isEditing ? editUser : addUser}>
        <h3>{isEditing ? "Edit User" : "Add User"}</h3>
        <label htmlFor='name'>Name:&nbsp;</label>
        <input 
          id='name'
          name='name'
          value={formValues.name}
          onChange={onInputChange}
        /><br/><br/>
        <label htmlFor='bio'>Bio:&nbsp;</label>
        <input 
          id='bio'
          name='bio'
          value={formValues.bio}
          onChange={onInputChange}
        /><br/><br/>
        {isEditing ? <button>Edit User</button> : <button>Add User</button>}&nbsp;
        {isEditing && <button onClick={closeEdit}>Cancel</button>}
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  );
}

export default App;
