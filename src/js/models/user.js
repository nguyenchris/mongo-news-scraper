import axios from 'axios';

export default class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  loginUser() {
    axios
      .post(`/login`, {
        name: this.name,
        email: this.email,
        password: this.password
      })
      .then(result => {
        this.isLoggedIn = res.data;
        console.log(this);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
