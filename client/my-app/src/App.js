import logo from './logo.svg';
import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import UserContextProvider from './components/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import Main from './components/Main';

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
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
