import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const signup = async () => {
        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                name, 
                username,
                password
            })
        })
        if(response.ok) {
            navigate("/login");
        }
        else {
            alert('Registration Unsuccessful');
        }
    }

    return (
        <div style={{marginTop: "10px"}}>
            <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" onClick={signup}>Submit</Button>

        </div>
    )
}

export default Signup; 