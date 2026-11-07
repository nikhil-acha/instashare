import './index.css'

import {Redirect} from 'react-router-dom'

import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BiSolidError} from 'react-icons/bi'

import PostItem from '../PostItem'

const apiStatusConstants = {
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class Posts extends Component {
  state = {postsList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getPosts()
  }

  onRetryPost = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getPosts)
  }

  toggleIsLiked = async id => {
    const postId = id
    const jwtToken = Cookies.get('jwt_token')
    const status = {like_status: true}
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      body: JSON.stringify(status),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      this.setState(prevState => ({
        postsList: prevState.postsList.map(eachPost => {
          if (postId === eachPost.postId) {
            return {
              ...eachPost,
              likesCount: eachPost.likesCount + 1,
              likeStatus: !eachPost.likeStatus,
            }
          }
          return eachPost
        }),
      }))
    }
  }

  toggleIsUnliked = async id => {
    const postId = id
    const jwtToken = Cookies.get('jwt_token')
    const status = {like_status: false}
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      body: JSON.stringify(status),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      this.setState(prevState => ({
        postsList: prevState.postsList.map(eachPost => {
          if (postId === eachPost.postId) {
            return {
              ...eachPost,
              likesCount: eachPost.likesCount - 1,
              likeStatus: !eachPost.likeStatus,
            }
          }
          return eachPost
        }),
      }))
    }
  }

  getPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.posts.map(eachItem => ({
        comments: eachItem.comments,
        createdAt: eachItem.created_at,
        likesCount: eachItem.likes_count,
        postsDetails: {
          caption: eachItem.post_details.caption,
          imageUrl: eachItem.post_details.image_url,
        },
        postId: eachItem.post_id,
        profilePic: eachItem.profile_pic,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
        likeStatus:
          eachItem.like_status === false || eachItem.like_status === undefined
            ? false
            : true,
      }))
      this.setState({
        postsList: updatedData,
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
      <button className="tryButton" type="button" onClick={this.onRetryPost}>
        Try again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {postsList} = this.state
    return (
      <ul className="posts">
        {postsList.map(eachItem => (
          <PostItem
            key={eachItem.postId}
            postData={eachItem}
            toggleLike={this.toggleIsLiked}
            toggleDislike={this.toggleIsUnliked}
          />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  render() {
    const {postsList, apiStatus} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    switch (apiStatus) {
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Posts
