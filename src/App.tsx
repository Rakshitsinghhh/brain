import { Routes ,Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './login'
import Signup from './signup'
import Home from './Home'


function App() {
const navigate = useNavigate();


  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => navigate("/home")} />} />
        <Route path="/signup" element={<Signup onSignUpSuccess={() => navigate("/home")} />} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </>
  )
}

export default App
