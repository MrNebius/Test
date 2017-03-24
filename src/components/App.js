import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { verifyUser } from '../actions'
import classNames  from 'classnames'
import '../styles/main.css'

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    if(localStorage.token) {
      this.props.dispatch(verifyUser())
    }
  }


  render() {
    const { location: { pathname } } = this.props;

    return (
      <div className="wrap">
        <ul className="wrap__nav">
          <li className={classNames({active: pathname.endsWith('map')})}>
            <Link to="map">
              Main Page
            </Link>
          </li>
          <li className={classNames({active: pathname.endsWith('authorization')})}>
            <Link to="authorization">
              Authorization
            </Link>
          </li>
          <li className={classNames({active: pathname.endsWith('aboutAuthor')})}>
            <Link to="aboutAuthor">
              About Author
            </Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(App)