import React, { useState, useEffect, useContext } from 'react';
import '../styling/Login.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../components/UserContext";
import { Stack } from '@mui/material';

const Main = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [formType, setFormType] = useState(null);
    const [name, setName] = useState('');  // Added for signup
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
        });

        if (response.ok) {
            const userInfo = await response.json();
            setUserInfo(userInfo);
            navigate('/home');
        } else {
            alert("Login unsuccessful");
        }
    };

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
        });

        if (response.ok) {
            login();
        } else {
            alert("Signup unsuccessful");
        }
    };

    return (
        <div className="login-container">
            
            {/*<h1 style={{color: "white"}}>Wisrr</h1>
            <h1 style={{color: "white"}}>Created By: Pranet Allu and Cyrus Estavillo</h1>
            <br />
            <br />
            <br />
    */}
            <img
                src={`${process.env.PUBLIC_URL}/WISRR_Logo-Inverted.jpeg`}
                alt="logo"
                className={`logo ${showButtons ? 'slide-up' : ''}`}
            />

            {formType ? (
                <div className="input-container">
                    {/* Display different input fields based on formType */}
                    {formType === 'signup' &&
                        <div className="white-input">
                            <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    }
                    <Stack direction="column">
                        <TextField className="white-input" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <TextField className="white-input" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {/* Dynamic submit button */}
                        <Button variant="contained" onClick={formType === 'signup' ? signup : login}>
                            Submit
                        </Button>
                    </Stack>
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

export default Main;
