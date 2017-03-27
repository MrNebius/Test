import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authUser, createNewUser, logout} from '../actions'

class Authorization extends Component {

  constructor(props) {
    super(props);
  }

  handleClick = attr => {
    const username = this.refs.username;
    const password = this.refs.password;
    const creds = {username: username.value.trim(), password: password.value.trim()};

    if (creds.username || creds.password) {
      if (attr) {
        this.props.dispatch(authUser(creds));
      } else {
        this.props.dispatch(createNewUser(creds));
      }
    } else {
      alert('You need to write something');
    }
  };

  handleClickLogOut = () => {
    this.props.dispatch(logout());
  };

  render() {
    const {isAuthenticated, message, isAuthenticating} = this.props.user;
    return (
      <div className="wrap__content">
        <span className="wrap__content-title">Authorization</span>
        <div className="wrap__content-selects">

          { !isAuthenticated ? (
            <div>
              <input type='text' ref='username' placeholder='Username' maxLength='21'/>
              <input type='password' ref='password' placeholder='Password' maxLength='21'/>
              <button onClick={() => this.handleClick(true)} disabled={isAuthenticating}>
                Login
              </button>
              <button onClick={() => this.handleClick(false)} disabled={isAuthenticating}>
                Create user
              </button>
            </div>
          ) : (
            <button onClick={this.handleClickLogOut}>
              LogOut
            </button>
          )}
          <div>{message}</div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Authorization)