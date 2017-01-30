import React, { Component } from 'react'
import { Link } from 'react-router'
import classNames  from 'classnames'
import '../styles/main.css'

export default class App extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { location: { pathname } } = this.props;

    return (
      <div className="wrap">
        <ul className="wrap__nav">
          <li className={classNames({active: pathname.endsWith('Chart')})}>
            <Link to="chart">
              Data Analysis
            </Link>
          </li>
          <li className={classNames({active: pathname.endsWith('Weather')})}>
            <Link to="weather">
              Today's Weather
            </Link>
          </li>
           <li className={classNames({active: pathname.endsWith('Map')})}>
              <Link to="map">
                Your Map
              </Link>
           </li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}