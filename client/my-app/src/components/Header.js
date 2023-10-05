import { Button } from "@mui/material"
// use display: "flex" in order to fix any align problem

const Header = () => {
    return (
        <div style={{
            minHeight: "80px", height: "40%", backgroundColor: "black", display: "flex", 
            alignContent: "center", alignItems: "center", justifyContent: "right"
        }}>  
            <Button variant="contained" href="/login" sx={{ marginRight: "6px" }}>Login</Button>
            <Button variant="contained" href="/signup" sx={{ marginRight: "10px" }}>Signup</Button>
        </div>
    )
}

export default Header; 