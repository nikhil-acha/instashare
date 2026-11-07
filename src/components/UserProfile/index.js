import {Component} from 'react'
import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import {BiSolidError} from 'react-icons/bi'

import {BiCamera} from 'react-icons/bi'

import Profile from '../Profile'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {userDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getUserDetails()
  }

  onRetry = () => {
    this.setState(
      {apiStatus: apiStatusConstants.inProgress},
      this.getUserDetails,
    )
  }

  getUserDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {history} = this.props
    const {match} = this.props
    const {userId} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const userData = data.user_details

      const updatedData = {
        followersCount: userData.followers_count,
        followingCount: userData.following_count,
        id: userData.id,
        posts: userData.posts.map(eachPost => ({
          id: eachPost.id,
          image: eachPost.image,
        })),
        postsCount: userData.posts_count,
        profilePic: userData.profile_pic,
        stories: userData.stories.map(eachItem => ({
          id: eachItem.id,
          image: eachItem.image,
        })),
        userBio: userData.user_bio,
        userId: userData.user_id,
        userName: userData.user_name,
      }
      this.setState({
        userDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://res.cloudinary.com/dgvara4ed/image/upload/v1790277042/Group_7522_zp1pdk.png"
        alt="failure view"
      />
      <p className="failureText">Something went wrong. Please try again</p>
      <button className="tryButton" type="button" onClick={this.onRetry}>
        Try again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {userDetails} = this.state
    return (
      <>
        <Profile userInfo={userDetails} />
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loaderView" testid="loader">
      <Loader type="TailSpin" height={50} width={50} color="#4094ff" />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {userDetails} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        {this.renderApiStatus()}
      </>
    )
  }
}
export default UserProfile
