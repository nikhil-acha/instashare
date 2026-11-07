import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import StorySlider from '../StorySlider'

import './index.css'

const apiStatusConstants = {
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class GetStories extends Component {
  state = {storiesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getStories()
  }

  onRetryStory = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getStories)
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.users_stories.map(eachItem => ({
        storyUrl: eachItem.story_url,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
      }))
      this.setState({
        storiesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  MultipleItems = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
    }
  }

  renderFailureView = () => (
    <div className="storyFailureview">
      <img
        src="https://res.cloudinary.com/dgvara4ed/image/upload/v1790277042/Group_7522_zp1pdk.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onRetryStory}>
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="storyLoadingView" testid="loader">
      <Loader type="TailSpin" height={50} width={50} color="#4094ff" />
    </div>
  )

  renderSuccessView = () => {
    const {storiesList} = this.state
    return (
      <>
        <StorySlider storiesData={storiesList} />
      </>
    )
  }

  render() {
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
}

export default GetStories
