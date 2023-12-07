import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { UserContext } from "../components/UserContext";
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Logo from "../images/WISRR_Logo_Square.jpeg"
import Paper from '@mui/material/Paper';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Audio',
    'Animals',
    'Biology',
    'Computer Science',
    'Finance',
    'Fitness',
    'Food',
    'History',
    'Machine Learning',
    'Math',
    'Medicine',
    'Music',
    'Non-STEM',
    'Philosophy',
    'Physics',
    'Software Engineering',
    'Text',
    'Tech',
    'Video'
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const Footer = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false);
    const [textVal, setText] = useState("");
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const username = userInfo?.username;
    const idVal = userInfo?._id;

    const handleClose = () => {
        setText("");
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const addPost = async () => {
        const response = await fetch('http://localhost:3001/post', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                text: textVal,
                author: idVal,
                tags: personName
            })
        });
        if (response.ok) {
            handleClose();
            window.location.reload();
        }
        else {
            alert("Adding Unsuccessful");
        }
    }

    return (
        <div style={{ position: "fixed", height: "30%", minHeight: "150px" }}>
            <Dialog
                open={open}
                onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Add a Post!
                </DialogTitle>
                <DialogContent >
                    <TextField
                        multiline
                        value={textVal}
                        placeholder="Share something with the world..."
                        onChange={(e) => setText(e.target.value)}
                        sx={{
                            width: "100%",

                        }}
                    />
                    <FormControl sx={{ marginTop: 2, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={addPost}>Post</Button>
                </DialogActions>
            </Dialog>
            {username && ((
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        sx={{ backgroundColor: "black" }}
                    >
                        <BottomNavigationAction href="/home" icon={<HomeRoundedIcon sx={{ color: "white" }} />} />
                        <BottomNavigationAction href="/search" icon={<SearchRoundedIcon sx={{ color: "white" }} />} />
                        <BottomNavigationAction onClick={handleOpen} icon={<AddIcon sx={{ color: "white" }} />} />
                        <BottomNavigationAction href="/notification" icon={<NotificationsRoundedIcon sx={{ color: "white" }} />} />
                        <BottomNavigationAction href="/profile" icon={<AccountCircleRoundedIcon sx={{ color: "white" }} />} />
                    </BottomNavigation>
                </Paper>
            ))}
        </div>
    )
}

export default Footer; 