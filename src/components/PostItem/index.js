import './index.css'

import {Link} from 'react-router-dom'

import {GrDislikeFill} from 'react-icons/gr'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {BsHeart} from 'react-icons/bs'

const PostItem = props => {
  const {postData, toggleLike, toggleDislike} = props
  const {
    comments,
    createdAt,
    likesCount,
    postId,
    postsDetails,
    profilePic,
    userId,
    userName,
    likeStatus,
  } = postData

  const updatedComments = comments.map(eachItem => ({
    comment: eachItem.comment,
    userName: eachItem.user_name,
    userId: eachItem.user_id,
    index: comments.indexOf(eachItem),
  }))
  console.log(updatedComments)

  const onPostLike = () => {
    toggleLike(postId)
  }

  const onPostUnlike = () => {
    toggleDislike(postId)
  }

  return (
    <li className="postItem">
      <Link to={`/users/${userId}`} className="userLink">
        <div className="profileSection">
          <img
            src={profilePic}
            className="profileImg"
            alt="post author profile"
          />
          <p className="profileName">{userName}</p>
        </div>
      </Link>
      <img src={postsDetails.imageUrl} className="post" alt="post" />
      <div className="info">
        <div className="interaction">
          {likeStatus ? (
            <button
              type="button"
              className="like-button"
              testid="unLikeIcon"
              onClick={onPostUnlike}
            >
              <FcLike size={24} className="icon" />
            </button>
          ) : (
            <button
              onClick={onPostLike}
              className="like-button"
              testid="likeIcon"
              type="button"
            >
              <BsHeart size={24} className="icon" />
            </button>
          )}
          <FaRegComment size={24} className="icon" />
          <BiShareAlt size={24} className="icon" />
        </div>
        <div className="likesSection">
          <p className="likesCount">{likesCount} likes</p>
          <p className="caption">{postsDetails.caption}</p>
          <ul className="commentsList">
            {updatedComments.map(eachComment => (
              <li
                key={`${eachComment.userId}-${eachComment.index}`}
                className="commentItem"
              >
                <Link to={`/users/${eachComment.userId}`} className="userLink">
                  <p className="comment">
                    <span className="commenter">{eachComment.userName}</span>
                    {eachComment.comment}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="time">{createdAt}</p>
        </div>
      </div>
    </li>
  )
}

export default PostItem
