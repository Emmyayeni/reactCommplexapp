import React,{useContext}  from "react"
import {Link} from 'react-router-dom'
import Headerloggedin from "./HeaderLoggedin"
import Userloggedout from "./UserLoggedout"
import StateContext from  '../StateContext'

function Header(props) {
  const appState = useContext(StateContext)
  return (
      <header className="header-bar bg-primary mb-0 ">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/" className="text-white">
            ComplexApp
            </Link>
          </h4>
        {appState.loggedIn ? <Headerloggedin /> : <Userloggedout />}
      
      </div>
    </header>
  )
}

export default Header
