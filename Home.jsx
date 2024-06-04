import React, { useEffect, useState } from 'react';
import Create from './Create'; // Assuming this is the updated Create component
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchTodos(); // Fetch todos on initial render
    }, []);

    const handleEdit = (id) => {
        axios.put(`http://localhost:3000/update/${id}`)
            .then(result => {
                if (result.data) {
                    setTodos(prevTodos => 
                        prevTodos.map(todo => 
                            todo._id === id ? { ...todo, done: !todo.done } : todo
                        )
                    );
                } else {
                    console.warn('Unexpected data format received:', result.data);
                }
            })
            .catch(err => console.error('Error updating todo:', err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/delete/${id}`)
            .then(result => {
                if (result.data) {
                    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
                } else {
                    console.warn('Unexpected data format received:', result.data);
                }
            })
            .catch(err => console.error('Error deleting todo:', err));
    };

    const fetchTodos = () => {
        axios.get('http://localhost:3000/get')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setTodos(response.data);
                } else {
                    console.warn('Unexpected data format received:', response.data);
                    setTodos([]); // Handle non-array data
                }
            })
            .catch(error => console.error('Error fetching data:', error)); // Improved error message
    };

    const addTodo = (newTodo) => {
        if (newTodo && newTodo.task) { // Check if newTodo is not empty and has a task property
            setTodos(prevTodos => [...prevTodos, newTodo]);
        }
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create addTodo={addTodo} /> {/* Pass addTodo function as prop to Create component */}
            {todos.length === 0 ? (
                <div><h2>No Record</h2></div>
            ) : (
                todos.map((todo, index) => (
                    <div className='task' key={index}>
                        <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                            {todo.done ? 
                                <BsFillCheckCircleFill className='icon' /> :
                                <BsCircleFill className='icon' />
                            }
                            <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                        </div>
                        <div>
                            <span><BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} /></span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
