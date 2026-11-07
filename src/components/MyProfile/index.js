import './index.css'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Component} from 'react'

import SelfProfile from '../SelfProfile'

import Header from '../Header'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class MyProfile extends Component {
  state = {profileDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getMyProfile()
  }

  onRetryForProfile = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getMyProfile)
  }

  getMyProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const {profile} = data

      const updatedData = {
        followersCount: profile.followers_count,
        followingCount: profile.following_count,
        id: profile.id,
        posts: profile.posts.map(eachPost => ({
          id: eachPost.id,
          image: eachPost.image,
        })),
        postsCount: profile.posts_count,
        profilePic: profile.profile_pic,
        stories: profile.stories.map(eachStory => ({
          id: eachStory.id,
          image: eachStory.image,
        })),
        userId: profile.user_id,
        userBio: profile.user_bio,
        userName: profile.user_name,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure">
      <img
        src="https://res.cloudinary.com/dgvara4ed/image/upload/v1790277042/Group_7522_zp1pdk.png"
        className="noPosts"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onRetryForProfile}>
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="searchLoadingProfile" testid="loader">
      <Loader type="TailSpin" height={50} width={50} color="#4094ff" />
    </div>
  )

  renderSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <>
        <SelfProfile userInfo={profileDetails} />
      </>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {profileDetails} = this.state
    return (
      <>
        <Header />
        {this.renderApiStatus()}
      </>
    )
  }
}

export default MyProfile
