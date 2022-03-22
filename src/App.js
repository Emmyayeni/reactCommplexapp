import React, {useReducer, useEffect, Suspense } from "react"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import axios from "axios"
import LoadingDotsIcon from "./components/LoadingDotsIcon"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Flashmessages from "./components/FlashMessages"
import Profile from "./components/profile"
import Editpost from "./components/EditPost"
import ProfileFollowers from "./components/ProfileFollowers"
import ProfileFollowing from "./components/profileFollowing"
import ProfilePosts from "./components/ProfilePosts"
// import NotFound from "./components/NotFound"
import './App.css';
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
const Createpost = React.lazy(() => import("./components/CreatePost"))
const Viewsinglepost = React.lazy(() => import("./components/ViewSinglePost"))
const Search = React.lazy(() => import("./components/Search"))
const Chat = React.lazy(() => import("./components/Chat"))
axios.defaults.baseURL = process.env.REACT_APP_BACKEND || "https://backend-server003.herokuapp.com"

function App(){
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user:{
      token: localStorage.getItem("complexappToken"),
      username:localStorage.getItem("complexappUsername"),
      avatar:localStorage.getItem("complexappAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount:0,

  }

  function ourReducer(draft, action){
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data 
        return 
      case "logout":
        draft.loggedIn = false
        return 
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "openSearch":
      draft.isSearchOpen = true
      return 
      case "closeSearch":
      draft.isSearchOpen = false
      return
      case "openChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen = false
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return 
      case "clearUnreadChatCount":
        draft.unreadChatCount= 0
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer,initialState)
  useEffect(() => {
    if (state.loggedIn){
      localStorage.setItem("complexappToken",state.user.token)
      localStorage.setItem("complexappUsername",state.user.username)
      localStorage.setItem("complexappAvatar",state.user.avatar)
     }
    else{
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      localStorage.removeItem("complexappAvatar")
    }

  },[state.loggedIn])

  useEffect(() => {
    if (state.requestCount) {
      // Send axios request here
      const ourRequest = axios.CancelToken.source()
      async function fetchResults(){
          try{
              const response = await axios.post('/checkToken',{token: state.user.token},{CancelToken: ourRequest.token})
             if(!response.data){
               dispatch({type: "logout"})
               dispatch({type:"flashMessage", value: "i need you to loggin again"})
             }
              console.log(response.data)
          }catch(e){
              console.log("there was a problem or the request was cancelled")
          }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  return (
   <StateContext.Provider value={state}>
     <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
        <Flashmessages messages={state.flashMessages} /> 
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
          <Routes>
            <Route path="/" element={state.loggedIn ? <Home/> : <HomeGuest />}/>
            <Route path="/create-post" element={<Createpost/>}/>
            <Route path="/post/:id" element={<Viewsinglepost/>}/>
            <Route path="post/:id/edit" element={<Editpost />}/>
            <Route path="/profile/:username/*" element={<Profile /> }>
              <Route path="" element={<ProfilePosts />}/>
              <Route path="followers" element={<ProfileFollowers />} />
              <Route path="following" element={<ProfileFollowing />} />
            </Route>
            <Route path="/about-us" element={<About/>}/>
            <Route path="/terms" element={<Terms/>}/>
          </Routes>
          </Suspense>
         <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
           <div className="search-overlay">
            <Suspense fallback=''>
              <Search />
            </Suspense>
          </div>
         </CSSTransition>
         <Suspense fallback="" >{state.loggedIn && <Chat/>}</Suspense>
          <Footer />
        </BrowserRouter>                                                                                                                                                                
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App;
