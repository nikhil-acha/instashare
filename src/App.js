import './App.css'

import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login'

import Home from './components/Home'

import Posts from './components/Posts'

import ProtectedRoute from './components/ProtectedRoute'

import UserProfile from './components/UserProfile'

import MyProfile from './components/MyProfile'

import NotFound from './components/NotFound'

const App = () => (
  <Switch>
    <Route exact path='/login' component={Login} />
    <ProtectedRoute exact path='/' component={Home} />
    <ProtectedRoute exact path='/users/:userId' component={UserProfile} />
    <ProtectedRoute exact path='/my-profile' component={MyProfile} />
    <Route path='/bad-path' component={NotFound} />
    <Redirect to='/bad-path' />
  </Switch>
)

export default App
