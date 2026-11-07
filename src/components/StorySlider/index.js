import React, {Component} from 'react'
import Slider from 'react-slick'

import './index.css'

function SampleNextArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', background: 'black'}}
      onClick={onClick}
    />
  )
}

function SamplePrevArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', background: 'grey'}}
      onClick={onClick}
    />
  )
}

const StorySlider = props => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  const {storiesData} = props
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {storiesData.map(eachStory => (
          <div className="storyItem" key={eachStory.userId}>
            <div>
              <img
                src={eachStory.storyUrl}
                className="image"
                alt="user story"
              />
              <p className="name">{eachStory.userName}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default StorySlider
