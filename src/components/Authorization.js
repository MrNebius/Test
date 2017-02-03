
import React, { Component, PropTypes } from 'react'

const request = require('superagent');

export default class Authorization extends Component {

  constructor (props) {
    super(props);
    this.state = {
      logged: false,
      message: ''
    };

    this.handleClickLogin = this.handleClickLogin.bind(this);
    this.handleClickLogOut = this.handleClickLogOut.bind(this);
  }
  handleClickLogin(event) {
    const username = this.refs.username;
    const password = this.refs.password;
    const creds = { username: username.value.trim(), password: password.value.trim() };
    console.log(creds);
    request.post('http://localhost:8080/auth/getToken/')
      .send(creds)
      .end((err, res) => {
        if(!err) {
          localStorage.setItem('id_token', res.body.token);
          this.setState({
            logged: true,
            message: 'You are logged'
          });

        }
        else {
          this.setState({message: 'Wrong password or username'})
        }
      console.log(localStorage)
    });
  }

  handleClickLogOut(event) {
    localStorage.setItem('id_token', undefined);
    this.setState({
      logged: false,
      message: ''
    });
    console.log(localStorage);
  }

  render() {
    const { errorMessage } = this.props;

    if(this.state.logged === false) {
      return (
        <div className="wrap__content">
          <span className="wrap__content-title">Authorization</span>

          <div>
            <input type='text' ref='username' className="form-control" placeholder='Username'/>
            <input type='password' ref='password' className="form-control" placeholder='Password'/>
            <button onClick={(event) => this.handleClickLogin(event)} className="btn btn-primary">
              Login
            </button>
            <div>{this.state.message}</div>
          </div>

        </div>
      )
    }
    else {
      return(
      <div className="wrap__content">
        <span className="wrap__content-title">Authorization</span>
        <div>
          <button onClick={(event) => this.handleClickLogOut(event)} className="btn btn-primary">
            LogOut
          </button>
           {this.state.message}
        </div>
      </div>
      )
    }
  }

}