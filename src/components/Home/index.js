import './index.css'

import {Component} from 'react'

import Header from '../Header'

import Posts from '../Posts'

import GetStories from '../GetStories'

import SearchPosts from '../SearchPosts'

class Home extends Component {
  state = {searchText: '', searchValue: ''}

  onSearchChange = event => {
    this.setState({searchText: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchValue, searchText} = this.state
    this.setState({searchValue: searchText, searchText: ''})
  }

  render() {
    const {searchText, searchValue} = this.state
    const isSearchEmpty = searchValue !== ''
    return (
      <>
        <Header
          searchChange={this.onSearchChange}
          text={searchText}
          value={searchValue}
          onClickIcon={this.onClickSearchIcon}
        />
        <div className='resultsContainer'>
          {isSearchEmpty ? (
            <SearchPosts searchInput={searchValue} />
          ) : (
            <>
              <GetStories />
              <Posts />
            </>
          )}
        </div>
      </>
    )
  }
}
export default Home
