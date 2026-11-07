import './index.css'

import {BiCamera} from 'react-icons/bi'

import {BsGrid3X3} from 'react-icons/bs'

const Profile = props => {
  const {userInfo} = props
  const {
    followingCount,
    followersCount,
    id,
    profilePic,
    postsCount,
    posts = [],
    stories = [],
    userBio,
    userId,
    userName,
  } = userInfo
  const storiesLength = stories.length > 0
  const isPostsCount = posts.length !== 0
  let storiesList
  if (stories.length > 0) {
    storiesList = (
      <ul className="highlights">
        {stories.map(eachItem => (
          <li key={eachItem.id}>
            <img
              src={eachItem.image}
              className="highlightimg"
              alt="user story"
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="profileContent">
      <div className="userProfileSection">
        <div className="imageSection">
          <img
            src={`${profilePic}`}
            className="profilePhoto"
            alt="user profile"
          />
        </div>

        <div className="followersPosts">
          <h4>{userName}</h4>
          <div className="followersSection">
            <p>
              <span className="count">{postsCount}</span> posts
            </p>
            <p>
              <span className="count">{followersCount}</span> followers
            </p>
            <p>
              <span className="count">{followingCount}</span> following
            </p>
          </div>
          <p>{userId}</p>
          <p>{userBio}</p>
        </div>
      </div>
      {storiesLength && storiesList}
      <hr className="horizontall" />
      <div className="postsSection">
        <div className="postsIconContainer">
          <BsGrid3X3 className="postIcon" />
          <h1 className="heading">Posts</h1>
        </div>
        {isPostsCount ? (
          <ul className="postsList">
            {posts.map(eachPost => (
              <li key={eachPost.id} className="profilepostItem">
                <img
                  src={eachPost.image}
                  className="postImgItem"
                  alt="user post"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="NoPostSection">
            <BiCamera className="noPost" />
            <h1>No Posts</h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
