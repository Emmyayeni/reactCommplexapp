import React, {useState,useContext} from 'react';
import axios from 'axios'
import {useNavigate,useLocation} from "react-router-dom"
import DispatchContext from '../DispatchContext'; 
import StateContext from '../StateContext'; 

const Createpost = (props) => {
  const [title,SetTitle] = useState()
  const [body,SetBody]= useState()
  const navigate = useNavigate()
  const location = useLocation()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  async function HandleSubmit(e){
    e.preventDefault()
    try{
        const response = await axios.post('/create-post',{title,body,token: appState.user.token})
        appDispatch({type: "flashMessage",value:"congrats you've successfuly created post"})                        
        navigate(`/post/${response.data}`)
        console.log("post succesful created ")
    }catch(e){
      console.log(`the problem is ${e}`)
    }
  }
    return (
        <div className="container container--narrow py-md-5">
        <form onSubmit={HandleSubmit}>
          <div className="form-group">
            <label htmlFor="post-title" className="text-muted mb-1">
              <small>Title</small>
            </label>
            <input onChange={(e) => SetTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          </div>
          <div className="form-group">
            <label htmlFor="post-body" className="text-muted mb-1 d-block">
              <small>Body Content</small>
            </label>
            <textarea onChange={(e) => SetBody(e.target.value)}name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
          </div>
  
          <button className="btn btn-primary" type="submit" >Save New Post</button>
        </form>
      </div>
  
    );
}

export default Createpost;
