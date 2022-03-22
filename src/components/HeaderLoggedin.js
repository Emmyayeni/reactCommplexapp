// eslint-disable-next-line
import React,{useContext} from 'react';
import {Link} from 'react-router-dom'
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactTooltip from 'react-tooltip'

function Headerloggedin(props) {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    // eslint-disable-next-line
    function handleLogout(){
        appDispatch({type: "logout"})
    } 
    function handleSearchIcon(e){
        e.preventDefault()
        appDispatch({type: "openSearch"})
    }
    function handleChatIcon(e){
        e.preventDefault()
        appDispatch({type: "openChat"})
    }
    return (
        <div className="flex-row my-3 my-md-0 on">
        <a data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
            <i className="fas fa-search"></i>
        <ReactTooltip  place="bottom" id="search" className="custom-tooltip" />
        </a>{" "} 
        <span onClick={() => appDispatch({ type: "openChat" })} data-for="chat" data-tip="Chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span> : ""}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
        <Link data-for="profile" data-tip="Profile" to={`/profile/${appState.user.username}`} className="mr-2 ">
            <img className="small-header-avatar" src={appState.user.avatar} alt="userprofile" />
            <ReactTooltip  place="bottom" id="profile" className="custom-tooltip" />
        </Link>{"   "}
        <Link className="btn btn-sm btn-success mr-2" to="/create-post">
            Create Post
        </Link>{"  "}
        <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
            Sign Out
        </button>
    </div>
    );
}

export default Headerloggedin;
