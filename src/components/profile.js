import React, { useEffect, useContext } from "react"
import Page from "./Page"
import { useParams, NavLink, Routes, Route,Outlet } from "react-router-dom"
import axios from "axios"
import StateContext from "../StateContext"
import ProfilePosts   from './ProfilePosts';
import ProfileFollowers from './ProfileFollowers'
import ProfileFollowing from './profileFollowing'
import { useImmer } from "use-immer"
        
const Profile= () => {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" }}})
        
  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
        
      async function fetchData() {
        try{
            const response = await axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
            setState(draft => {
              draft.profileData = response.data
            })
        }catch(e){
            console.log("There was a problem.")
        }
        }
          fetchData()
          return () => {
            ourRequest.cancel()
          }
  }, [username])
        
  useEffect(() => {
    if(state.startFollowingRequestCount) {
        setState(draft => {
          draft.followActionLoading = true
        })        
        const ourRequest = axios.CancelToken.source()      
        async function fetchData() {
          try{
            const response = await axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
            setState(draft => {
              draft.profileData.isFollowing = true
              draft.profileData.counts.followerCount++
              draft.followActionLoading = false
            })
          }catch(e) {
              console.log("There was a problem.")
          }
          }
          fetchData()
          return () => {
            ourRequest.cancel()
            }
          }
    }, [state.startFollowingRequestCount])
        
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
        setState(draft => {
        draft.followActionLoading = true
      })
        
      const ourRequest = axios.CancelToken.source()
        
      async function fetchData() {
        try{
            const response = await axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
            setState(draft => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
            draft.followActionLoading = false
          })
        }catch(e){
          console.log("There was a problem.")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
        }
      }
    }, [state.stopFollowingRequestCount])
        
  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }
        
  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }
        
  return (
    <Page title="Profile Screen">
      <h2>
      <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
      {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
        <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      )}
      {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
        <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
          Stop Following <i className="fas fa-user-times"></i>
        </button>
      )}
      </h2>
        
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink className={(navData) => navData.isActive ? 'active nav-item nav-link' : "nav-item nav-link"} to={`/profile/${state.profileData.profileUsername}`}>
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink className={(navData) => navData.isActive ? 'active nav-item nav-link' : "nav-item nav-link"} to={`/profile/${state.profileData.profileUsername}/followers`}>
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink className={(navData) => navData.isActive ? 'active nav-item nav-link' : "nav-item nav-link"} to={`/profile/${state.profileData.profileUsername}/following`} >
          Following: {state.profileData.counts.followingCount}
        </NavLink>
        
      </div> 
      <Outlet />
    </Page>

  );
}

export default Profile