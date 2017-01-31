'use strict'

import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { render as renderComponent } from 'react-dom'

import {
  App,
  Chart,
  Weather,
  Map,
  AboutAuthor

} from './components'

renderComponent(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <Route path='chart' component={Chart} />
      <Route path='map' component={Map}/>
      <Route path='weather' component={Weather} />
      <Route path='aboutauthor' component={AboutAuthor} />
    </Route>
  </Router>,
  document.getElementById('app')
)
