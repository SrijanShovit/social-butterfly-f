import { BrowserRouter as Router, Route,Switch,useHistory } from 'react-router-dom'
import { useEffect, createContext,useReducer,useContext } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import Home from './screens/Home'
import Login from './screens/Login'
import Profile from './screens/Profile'
import UserProfile from './screens/UserProfile'
import Signup from './screens/Signup'
import Createpost from './screens/Createpost'
import Subscribed from './screens/Subscribed'
import {reducer,initialState} from './reducers/userReducer'

export const UserContext = createContext()

//we can't use history in App beacuse it's enclosed in Router
//now we can use history in Routing

const Routing = () => {
  const history = useHistory();
  //if user just closed application but not signed out they should still see logged in data
  const {state,dispatch} = useContext(UserContext);
  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user)
    if (user) {
      dispatch({type:"USER",payload:user})
      // history.push('/')
    }else{
      history.push('/signin')
    }
  },[])
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/createpost" component={Createpost} />
      <Route path="/myfollowingpost" component={Subscribed} />
    </Switch>
  )
}

function App() {

  
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}} >

      <Router>
        <Navbar />
        <Routing/>



      </Router>
    </UserContext.Provider>

  );
}

export default App;
