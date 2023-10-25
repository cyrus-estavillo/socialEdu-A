import React, { useState, useEffect, useContext } from 'react';
import '../styling/Login.css'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../components/UserContext";

const Login = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [formType, setFormType] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
        setShowButtons(true);
        }, 3000);
    }, []);

    const handleButtonClick = (type) => {
        setFormType(type);
    };

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
        <div className="login-container">
          <img
            src={`${process.env.PUBLIC_URL}/WISRR_Logo-Inverted.jpeg`}
            alt="logo"
            className={`logo ${showButtons ? 'slide-up' : ''}`}
          />
          {formType ? (
            <div className="input-container">
                <div className="white-input"> 
                <TextField label="Username" variant="outlined"  value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button variant="contained" onClick={login}>Submit</Button>
            </div>
          ) : (
            <div className={`button-container ${showButtons ? 'visible' : ''}`}>
              <Button variant="contained" onClick={() => handleButtonClick('login')}>Login</Button>
              <Button variant="contained" onClick={() => handleButtonClick('signup')}>Sign Up</Button>
            </div>
          )}
        </div>
    )
}

export default Login; 