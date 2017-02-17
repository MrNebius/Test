import React, { Component } from 'react'
import classNames from 'classnames'


export default class AboutAuthor extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="wrap__content">
        <span className="wrap__content-title">About author</span>
        <span className='author__img'/>
        <span className="author__him"> Created by: MrNebius</span>
      </div>
    )
  }
}