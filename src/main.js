import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { render as renderComponent } from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import {
  App,
  Authorization,
  AboutAuthor,
  Map
} from './components'

import * as reducers from './reducers'

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  applyMiddleware(
    thunkMiddleware
  )
);

const history = syncHistoryWithStore(browserHistory, store);

renderComponent(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='authorization' component={Authorization}/>
        <Route path='map' component={Map}/>
        <Route path='aboutAuthor' component={AboutAuthor}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
