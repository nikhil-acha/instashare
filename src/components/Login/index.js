import {Component} from 'react'
import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onSubmitForm = async event => {
    event.preventDefault()

    const url = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onLoginFailure = error => {
    this.setState({showError: true, errorMsg: error})
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <>
        <div className="login-container">
          <div className="logo-container">
            <img
              src="https://res.cloudinary.com/dgvara4ed/image/upload/v1787597092/Illustration_iwg0ie.png"
              className="Websitelogo"
              alt="website login"
            />
          </div>
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://res.cloudinary.com/dgvara4ed/image/upload/v1787597423/logo_iy6fho.png"
              className="form-logo"
              alt="website logo"
            />
            <h1 className="companyName">Insta Share</h1>
            <div className="input-container">
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                className="inputUsername"
                value={username}
                onChange={this.onChangeUsername}
                id="username"
              />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={this.onChangePassword}
                id="password"
              />
            </div>
            {showError && <p className="errorMsg">{errorMsg}</p>}
            <button type="submit" className="login">
              Login
            </button>
          </form>
        </div>
      </>
    )
  }
}
export default Login
