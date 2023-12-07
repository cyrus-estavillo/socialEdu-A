import logo from './logo.svg';
import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import UserContextProvider from './components/UserContext';
import QueryPosts from './components/QueryPosts';  
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Notification from './pages/Notification';
import Profile from './pages/Profile';
import Search from './pages/Search';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserContextProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Main />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/search" element={<Search />}/>
            <Route path="/posts/:query" element={<QueryPosts />} />
            <Route path="/notification" element={<Notification />}/>
            <Route path="/profile" element={<Profile />}/>
          </Routes>
          <Footer />
        </UserContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
