import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';


const Signup = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <TextField label="Outlined" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Outlined" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Outlined" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
    )
}

export default Signup; 