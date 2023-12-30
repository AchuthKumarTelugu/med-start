
import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import medicalLogo from './assets/medicalLogo.png'
import Home from './Components/Home'
import HospitalDetails from './Components/HospitalDetails'

function App() {
 let navigate=useNavigate()
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid black'}}>
        <img src={medicalLogo} style={{width:'8rem'}}/>
        <h1 onClick={()=>navigate('/')} style={{color:'#0873bb'}}>Med Start</h1>
      </div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/hospitalDetails' element={<HospitalDetails/>}/>
      </Routes>
    </div>
  )
}

export default App
