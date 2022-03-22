import React, { useEffect, useState,useContext } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link,useNavigate} from "react-router-dom"
import axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Notfound from "./notfound"
function Editpost(props) {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
    const originalState = {
        title: {
          value: "",
          hasErrors: false,
          message: ""
        },
        body: {
          value: "",
          hasErrors: false,
          message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false
      }
    
      function ourReducer(draft, action) {
        switch (action.type) {
          case "fetchComplete":
            draft.title.value = action.value.title
            draft.body.value = action.value.body
            draft.isFetching = false
            return
          case "titleChange":
             draft.title.value = action.value
             draft.title.hasErrors = false
             return 
          case "BodyChange":
             draft.body.value = action.value
             draft.body.hasErrors = false
             return 
          case  "SubmitRequest":
            if(!draft.title.hasErrors && !draft.body.hasErrors){
            draft.sendCount++ }
            return 
          case "saveRequestStarted":
            draft.isSaving = true
            return
          case "saveRequestFinished":
            draft.isSaving = false
            return
          case "titleRules":
            if(!action.value.trim()){
              draft.title.hasErrors = true
              draft.title.message = "you must provide a title"
            
            }
            return
          case "BodyRules":
            if(!action.value.trim()){
              draft.body.hasErrors = true
              draft.body.message = "you must provide a body content"
              
            }
            return
          case "notFound":
            draft.notFound = true
            return
        }
      }
    
      const [state, dispatch] = useImmerReducer(ourReducer, originalState)
    
      useEffect(() => {
        const ourRequest = axios.CancelToken.source()
        async function fetchPost() {
          try {
            const response = await axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
          if (response.data){
            dispatch({ type: "fetchComplete", value: response.data })
            if(appState.user.username !=response.data.author.username){
              appDispatch({type:"flashMessage", value:"You do not have permission to edit this post"})
              // redirect to hompage
              navigate("/")
            }
          }
          else{
            dispatch({type: "notFound"})
          }
          } catch (e) {
            console.log("There was a problem or the request was cancelled.")
          }
        }
        fetchPost()
        return () => {
          ourRequest.cancel()
        }
      }, [])
      useEffect(() => {
        if (state.sendCount){
          dispatch({type: "saveRequestStarted"})
          const ourRequest = axios.CancelToken.source()
        async function fetchPost() {
          try {
            const response = await axios.post(`/post/${state.id}/edit`,{title:state.title.value,body:state.body.value,token:appState.user.token}, { cancelToken: ourRequest.token })
           appDispatch({type: "flashMessage",value: "post successfully edited"})
            dispatch({type: "saveRequestFinished"})
          } catch (e) {
            console.log("There was a problem or the request was cancelled.")
          }
        }
        fetchPost()
        return () => {
          ourRequest.cancel()
        }
        }
      }, [state.sendCount])
    
      if(state.notFound){
        return (
          <Notfound />
         )
    }
      if (state.isFetching)
        return (
          <Page title="...">
            <LoadingDotsIcon />
          </Page>
        )
      function submitHanler(e){
        e.preventDefault()
        dispatch({type: "titleRules", value:state.title.value})
        dispatch({type: "BodyRules", value:state.body.value})
        dispatch({type: "SubmitRequest"})
      }
      return (
        <Page title="Edit Post">
          <Link className="small font-weight-bold" to={`/post/${state.id}`}>&laquo; Back to view post </Link>
          <form className="mt-3" onSubmit={submitHanler}>
            <div className="form-group">
              <label htmlFor="post-title" className="text-muted mb-1">
                <small>Title</small>
              </label>
              <input onBlur={e => dispatch({type: "titleRules", value:e.target.value})} onChange={e => dispatch({type: "titleChange", value: e.target.value})} value={state.title.value}  autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text"  autoComplete="off" />
              {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage tp">{state.title.message}</div>}
            </div>
    
            <div className="form-group">
              <label htmlFor="post-body" className="text-muted mb-1 d-block">
                <small>Body Content</small>
              </label>
              <textarea onBlur={e => dispatch({type: "BodyRules", value:e.target.value})} onChange={e => dispatch({type: "BodyChange",value: e.target.value})} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
              {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage tp">{state.body.message}</div>}
            </div>
    
            <button className="btn btn-primary" disabled={state.isSaving}>Save Updates</button>
          </form>
        </Page>
      )
    }

export default Editpost