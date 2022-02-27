import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './pages/Auth';
import Init from './pages/Init';
import Profile from './pages/Profile';
import Saved from './pages/Saved';


// TODO: figure out hosting on VPS for api and frontend
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/init' element={<Init />} />
        </Routes>
      </BrowserRouter>    
    </div>
  );
}

export default App;
