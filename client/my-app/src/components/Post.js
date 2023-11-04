import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button, IconButton } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
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
import Stack from "@mui/material/Stack";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import {Select} from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import Comment from './Comment';
import Chip from '@mui/material/Chip';


const Post = (props) => {
    const { userInfo } = useContext(UserContext);
    const userInfoId = userInfo?.id;
    const [user, setUser] = useState({
        _id: "",
        name: "",
        username: "",
        password: "",
        following: [],
        liked: [],
    });

    const tagList = props.tags;

    const [logged, setLogged] = useState(); 
    const [likedPost, setLike] = useState(false);
    const [showComments, setComments] = useState(false);
    const [commentDes, setCommentDes] = useState([]);
    const [commentPos, setCommentPos] = useState("");
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    }


    const authorID = props.authorID;
    const postID = props.postID;

    const loggedUser = async () => {
        const response = await fetch(`http://localhost:3001/user/${userInfoId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if(response.ok) {
            setLogged(data.userSpecific);
        }
    }

    useEffect(() => {
        loggedUser();
    }, [userInfoId])

    const getAllComments = async () => {
        const response = await fetch(`http://localhost:3001/commentsByPost/${postID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        setCommentDes(data.commentsWithDescription);
    }

    useEffect(() => {
        getAllComments();
    }, [])


    const popComments = () => {
        if (showComments) {
            setComments(false);
        }
        else {
            setComments(true);
        }
    }


    const getAllLikedPosts = async () => {
        const response = await fetch(`http://localhost:3001/userLiked`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();

        if (data.userLikedPosts.includes(postID)) {
            setLike(true);
        }
        else {
            setLike(false);
        }
    };

    useEffect(() => {
        getAllLikedPosts();
    }, [])

    const likeButtonClick = async () => {
        const response = await fetch(`http://localhost:3001/like/${postID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        window.location.reload();
    }

    const getAuthorDetailsOfPost = async () => {
        const response = await fetch(`http://localhost:3001/user/${authorID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        setUser(data.userSpecific);
    }

    useEffect(() => {
        getAuthorDetailsOfPost();
    }, [])

    const postComment = async () => {
        const response = await fetch(`http://localhost:3001/comment/${postID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                text: commentPos
            })
        })
        if (response.ok) {
            handleClose();
            window.location.reload();
        }
    }

    const deletePost = async () => {
        const response = await fetch(`http://localhost:3001/post/${postID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        if (response.ok) {
            window.location.reload();
        }
    }

    const addToFollowing = async () => {
        const response = await fetch(`http://localhost:3001/addFollowing/${authorID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            window.location.reload();
        }
    }

    var date = new Date(props.date);

    const followingList = logged?.following; 
    console.log(followingList);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Add a Comment!
                </DialogTitle>
                <DialogContent >
                    <TextField sx={{ width: 400 }}
                        multiline
                        value={commentPos}
                        onChange={(e) => setCommentPos(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={postComment}>Post</Button>
                </DialogActions>
            </Dialog>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Card sx={{ width: "80%", height: "100%", borderBottom: "1px solid #d3d3d3" }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Stack direction="row">
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>{user.name}</Typography>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", marginLeft: 1 }}>@{user.username}</Typography>
                                {followingList && (!followingList.includes(authorID) && authorID !== userInfoId) && (<Button variant="contained" sx={{borderRadius: 2}} onClick={addToFollowing}>Follow</Button>)}
                                {followingList && (followingList.includes(authorID) && authorID !== userInfoId) && (<Button variant="contained" sx={{borderRadius: 2}} onClick={addToFollowing}>unFollow</Button>)}
                            </Stack>
                            <Stack direction="row">
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>{date.toLocaleString().substring(0, 10)}</Typography>
                                {userInfoId == props.authorID && (
                                    <IconButton onClick={deletePost}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        </Stack>
                        <Stack direction="row">
                            <Typography variant="body1" gutterBottom>{props.text}</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginTop: 0.5 }}>
                            {tagList.map((tag) => (
                                <Chip label={tag} variant="outlined" sx={{ marginRight: 1 }} />
                            ))}
                        </Stack>
                        <CardActions sx={{ justifyContent: "space-evenly" }}>
                            <IconButton onClick={handleOpen}><ForumOutlinedIcon /></IconButton>
                            <Stack direction="row">
                                {likedPost ? (
                                    <IconButton onClick={likeButtonClick}>
                                        <FavoriteIcon sx={{ color: "red" }} />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={likeButtonClick}>
                                        <FavoriteBorderIcon />
                                    </IconButton>
                                )}
                                <p>{props.likeCount}</p>
                            </Stack>
                            {showComments ? (<IconButton onClick={popComments}>
                                <ExpandLessIcon />
                            </IconButton>) : (<IconButton onClick={popComments}>
                                <ExpandMoreIcon />
                            </IconButton>)}
                        </CardActions>
                    </CardContent>
                </Card>
                {showComments && (
                    commentDes.map((com) => (
                        <Comment text={com.text} author={com.commentAuthor} commentID={com._id} />
                    ))
                )}
            </div>
        </div >
    )
}

export default Post; 