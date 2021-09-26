import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  const renderList =  ()=> {
    if (state){
        return [
          <li><Link to="/profile">Profile</Link></li>,
            <li><Link to="/createpost">Create Post</Link></li>,
            <li><Link to="/myfollowingpost">My Following</Link></li>,
            <li><button className="btn waves-effect waves-light #448aff blue accent-2" 
            onClick={()=>{
              localStorage.clear()
              dispatch({type: 'CLEAR'})
              history.push('/signin')
            }}>Logout</button></li>
        ]
    }else{
      return [
        <li><Link to="/signin">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]

    }
  }
      return (
        <>
          <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "signin"} className="brand-logo left">Social Butterfly</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
            
          </ul>
        </div>
      </nav>   
        </>
    )
}

export default Navbar
