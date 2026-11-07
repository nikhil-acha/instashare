import './index.css'

const NotFound = props => {
  const onNavigateHome = () => {
    const {history} = props
    history.push('/')
  }

  return (
    <div className="errorSection">
      <img
        src="https://res.cloudinary.com/dgvara4ed/image/upload/v1790103198/Group_nw7qur.png"
        alt="page not found"
      />
      <h1>Page Not Found</h1>
      <p className="errorText">
        we are sorry, the page you requested could not be found
        <br />
        Please go back to the homepage.
      </p>
      <button type="button" onClick={onNavigateHome}>
        Home page
      </button>
    </div>
  )
}

export default NotFound
