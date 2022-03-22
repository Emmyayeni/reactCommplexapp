import React,{useContext} from 'react'
import {Link} from 'react-router-dom'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

function Post(props) {
    const appState = useContext(StateContext)
    const appDispatch=useContext(DispatchContext)
    const post = props.post
    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} `
    return (
        <Link onClick={() => appDispatch({type:"closeSearch"})}key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action"> 
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> {" "}
            by {!props.noAuthor && <> by {post.author.username}</>} <span className="text-muted small">{dateFormatted}</span> 
        </Link>
    )
}
export default Post
