import React, { useEffect, useState,useContext } from "react"
import Page from "./Page"
import { useParams, Link,useNavigate } from "react-router-dom"
import axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactTooltip from 'react-tooltip'
import Notfound from "./notfound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const appDispatch = useContext(DispatchContext)
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`)
        setPost(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log(`There was a problem.${e}`)
      }
    }
    fetchPost()
  }, [id])

  if (!isLoading && !post){
    return (<Notfound/>)
  }
  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  function isOwner(){
    if (appState.loggedIn){
      return appState.user.username == post.author.username
    }
    return false
  }
  
   async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          // 1. display a flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted." })

          // 2. redirect back to the current user's profile
          navigate(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log("There was a problem.")
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && ( <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2" >
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
          <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
        )}
        </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt="user-image"/>
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">{post.body}</div> 
    </Page>
  )
}

export default ViewSinglePost