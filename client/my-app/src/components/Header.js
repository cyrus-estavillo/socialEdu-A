import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { UserContext } from "../components/UserContext";
import Logo from "../images/WISRR_Logo_Square.jpeg"
import { useLocation } from 'react-router-dom';


const Header = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const location = useLocation();
    const pathname = location.pathname;
    console.log(pathname);

    

    const getProfile = async () => {
        const response = await fetch('http://localhost:3001/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        setUserInfo(data);
    }

    useEffect(() => {
        getProfile();
    }, []);


    const logout = async () => {
        const response = await fetch('http://localhost:3001/logout', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });
        if (response.ok) {
            setUserInfo(null);
            navigate("/");
        }
        else {
            alert("Logout Failed")
        }
    }

    const username = userInfo?.username;

    return (
        <div style={{ zIndex: 1000, position: 'fixed', top: 0, width: '100%', backgroundColor: 'white' }}>
            {!username &&
                (<div style={{
                    minHeight: "80px", height: "20%", display: "flex",
                    alignContent: "center", alignItems: "center", justifyContent: "right",
                    paddingTop: "10px", paddingRight: "5px", paddingLeft: "5px",
                }}>
                    <Button variant="contained" href="/login" sx={{ marginRight: "6px" }}>Login</Button>
                    <Button variant="contained" href="/signup" sx={{ marginRight: "10px" }}>Signup</Button></div>
                )}
            {username &&
                (<div style={{
                    minHeight: "80px", height: "40%", display: "flex",
                    alignContent: "center", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "20px", paddingBottom: "30px", paddingLeft: "120px", paddingRight: "40px"
                }}>
                    <div></div>
                    <img src={Logo} style={{ width: 100, height: 90 }}></img>
                    <Button variant="contained" href="/" onClick={logout} sx={{ backgroundColor: 'black', color: 'white' }}>Logout</Button>
                </div>
                )}

        </div>
    )
}

export default Header; 