import React,{useState,useContext} from 'react';
import axios from 'axios'
import DispatchContext from '../DispatchContext';

function Userloggedout(props){

    const appDispatch = useContext(DispatchContext)
    const [username,SetUsername]=useState()
    const [password,SetPassword]=useState()

    async function HandleSubmit(e){
        e.preventDefault()
     try{
        const response = await axios.post('/login',{username,password})
        console.log(response.data)
        if(response.data){
            appDispatch({type: "login",data:response.data})
        }else{
            console.log("invalid login ")
        }
     }catch(e){
        console.log(`there was a problem ${e} `)
     }

    }

    return (
        <form onSubmit={HandleSubmit} className="mb-0 pt-2 pt-md-0 on">
        <div className="row align-items-right">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={x => SetUsername(x.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={x => SetPassword(x.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
    )
}

export default Userloggedout;

