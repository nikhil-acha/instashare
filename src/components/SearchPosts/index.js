import './index.css'

import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import PostItem from '../PostItem'

const apiStatusConstants = {
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
  empty: 'EMPTY',
}

class SearchPosts extends Component {
  state = {searchResults: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getSearchResults()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchInput !== this.props.searchInput) {
      this.getSearchResults()
    }
  }

  onRetrySearch = () => {
    this.setState(
      {apiStatus: apiStatusConstants.inProgress},
      this.getSearchResults,
    )
  }

  isPostLiked = async id => {
    const postId = id
    const jwtToken = Cookies.get('jwt_token')
    const status = {like_status: true}
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      body: JSON.stringify(status),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      this.setState(prevState => ({
        searchResults: prevState.searchResults.map(eachPost => {
          if (postId === eachPost.postId) {
            return {
              ...eachPost,
              likesCount: eachPost.likesCount + 1,
              likeStatus: true,
            }
          }
          return eachPost
        }),
      }))
    }
  }

  isPostUnliked = async id => {
    const postId = id
    const jwtToken = Cookies.get('jwt_token')
    const status = {like_status: false}
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      body: JSON.stringify(status),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      this.setState(prevState => ({
        searchResults: prevState.searchResults.map(eachPost => {
          if (postId === eachPost.postId) {
            return {
              ...eachPost,
              likesCount: eachPost.likesCount - 1,
              likeStatus: false,
            }
          }
          return eachPost
        }),
      }))
    }
  }

  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.props
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
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
      if (data.posts.length > 0) {
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
          searchResults: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.empty, searchResults: []})
      }
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoPostView = () => (
    <div className="noPostView">
      <img
        src="https://res.cloudinary.com/dgvara4ed/image/upload/v1790276028/Group_1_s7e7ml.png"
        className="noPosts"
        alt="search not found"
      />
      <h1>Search Not Found</h1>
      <p>Try different keyword or search again</p>
    </div>
  )

  renderLoadingView = () => (
    <div className="searchLoading" testid="loader">
      <Loader type="TailSpin" height={50} width={50} color="#4094ff" />
    </div>
  )

  renderSuccessView = () => {
    const {searchResults} = this.state
    return (
      <div className="searchResultsContainer">
        <h1 className="resultHeading">Search Results</h1>
        <ul className="searchResultPosts">
          {searchResults.map(eachItem => (
            <PostItem
              key={eachItem.postId}
              postData={eachItem}
              toggleLike={this.isPostLiked}
              toggleDislike={this.isPostUnliked}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="noPostView">
      <img
        src="https://res.cloudinary.com/dgvara4ed/image/upload/v1790277042/Group_7522_zp1pdk.png"
        className="noPosts"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onRetrySearch}>
        Try again
      </button>
    </div>
  )

  render() {
    const {searchResults, apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.empty:
        return this.renderNoPostView()
      default:
        return null
    }
  }
}

export default SearchPosts
