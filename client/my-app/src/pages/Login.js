import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../components/UserContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUserInfo } = useContext(UserContext);

    const navigate = useNavigate();

    const login = async () => {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username,
                password
            })
        })

        if (response.ok) {
            const userInfo = await response.json();
            console.log(userInfo);
            setUserInfo(userInfo);
            navigate('/home');
            /*response.json().then(userInfo => {
                setUserInfo(userInfo);
                navigate('/home');
            });*/
        }
        else {
            alert("login unsuccessful");
        }
    }

    return (
        <div style={{ marginTop: "10px" }}>
            <TextField label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" onClick={login}>Submit</Button>
        </div>
    )
}

export default Login; 