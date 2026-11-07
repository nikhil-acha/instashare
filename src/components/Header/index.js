import './index.css'
import Cookies from 'js-cookie'

import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'

import {FaSearch} from 'react-icons/fa'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onSearchText = event => {
    const {searchChange, text} = this.props
    searchChange(event)
  }

  onClickSearch = () => {
    const {onClickIcon} = this.props
    onClickIcon()
  }

  render() {
    const {text, value} = this.props
    return (
      <nav className="nav">
        <div className="nav-lg-section">
          <div className="logoSection">
            <Link to="/">
              <img
                className="header-logo"
                src="https://res.cloudinary.com/dgvara4ed/image/upload/v1787597423/logo_iy6fho.png"
                alt="website logo"
              />
            </Link>
            <h1 className="logoHeading">Insta Share</h1>
          </div>
          <div className="nav-links-search">
            <div className="inputSection">
              <input
                type="search"
                className="inputSearch"
                placeholder="Search Caption"
                onChange={this.onSearchText}
                value={text}
              />
              <button
                className="searchButton"
                testid="searchIcon"
                type="button"
                onClick={this.onClickSearch}
              >
                <FaSearch className="icon" />
              </button>
            </div>
            <ul className="nav-links">
              <li>
                <Link to="/" className="link-item">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/my-profile" className="link-item">
                  Profile
                </Link>
              </li>
              <li className="link-item">
                <button
                  className="LogoutButton1"
                  onClick={this.onClickLogout}
                  type="button"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
