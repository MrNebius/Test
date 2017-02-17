import React, { Component } from 'react'
import classNames from 'classnames'


export default class Weather extends Component {
  constructor (props) {
  super(props)
  }

  render () {
    return (
         <div className="wrap__content">
            <span className="wrap__content-title">About author</span>
              <div className="wrap__content-info weather">
                <span className='weather__img' />
                  <span className="weather__him"> Created by: MrNebius</span>
              </div>
            </div>
    )
  }
}