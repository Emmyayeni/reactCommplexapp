import React,{useContext,useEffect} from 'react';
import {Link} from 'react-router-dom'
import {useImmer} from 'use-immer'
import StateContext from "../StateContext"
import axios from 'axios'
import LoadingDotsIcon from "./LoadingDotsIcon"
import Page from './Page';
import Post from './Post';
function Home(){
    const appState = useContext(StateContext)
    const [state,setState] = useImmer({
        isLoading: true,
        feed:[]
    })
    useEffect(() => {
        const ourRequest = axios.CancelToken.source()
            
          async function fetchData() {
            try{
                const response = await axios.post('/getHomeFeed', { token: appState.user.token }, { cancelToken: ourRequest.token })
                setState(draft => {
                  draft.isLoading = false
                  draft.feed= response.data
                })
            }catch(e){
                console.log("There was a problem.")
            }
            }
              fetchData()
              return () => {
                ourRequest.cancel()
              }
    }, [])

    if (state.isLoading) return <LoadingDotsIcon />
    return (
        <Page title="your feed">
            {state.feed.length == 0 && (
                <div className="container container--narrow py-md-5">
                <h2 className="text-center">Hello <strong>{appState.user.username}</strong>, your feed is empty.</h2>
                <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
              </div>
            )}
            {state.feed.length > 0 &&(
                <>
                    <h2 className="text-center mb-4"> the lastest from those You follow </h2>
                    <div className="list-group">
                        {state.feed.map(post => {
                            return <Post post={post} key={post._id}/>
                        })}
                    </div>    
                </>
            )}
        </Page>
);
}

export default Home;
