import React, { Component } from 'react'
import classNames from 'classnames'

export default class AboutAuthor extends Components {
  constructor (props) {
    super (props);
  }
}
render() {
  return (
    <div className="wrap__content">
      <span className="wrap__content-title">About author:</span>
      <span className={classNames('weather__img', weatherIconClass)} />
      <div className="weather__him">
        <span>bla bla bla</span>
      </div>

    </div>
  )
}