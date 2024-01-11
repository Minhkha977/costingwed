import { useState } from "react";

function App() {
const [name,setName] = useState('')
const [email,setEmail] = useState('')
const [noti,setNoti] = useState('')

const handleCount = () =>{
  if(name === 'kha' && email === 'kha@gmail'){
    setNoti('Đăng nhập thành công')
  }
  else {
    setNoti('Cook')
  }
   console.log({name,email})
}

  return (
    <div className="App" style={{padding: 40,fontSize: 30}}>
      <h1>{noti}</h1>
      <input style={{height: 30}} value={name} onChange={e=>setName(e.target.value)}></input>
      <input style={{height: 30}} value={email} onChange={e=>setEmail(e.target.value)}></input>
      <button style={{fontSize: 40}} onClick={handleCount} >Login</button>
    </div>

  );
}

export default App;
