import axios from 'axios';
import { invalidCredentials } from '../views/errorViews';
import { renderComment } from '../views/articlesView';

export default class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static loginUser(user) {
    axios
      .post(`/login`, user)
      .then(result => {
        if (result.status == 201) return window.location.assign('/');
      })
      .catch(err => {
        if (err.response) {
          return invalidCredentials(err.response.data.error);
        }
      });
  }

  static signupUser(user) {
    axios
      .post(`/signup`, user)
      .then(result => {
        if (result.status == 201) return window.location.assign('/');
      })
      .catch(err => {
        if (err.response) {
          return invalidCredentials(err.response.data.error);
        }
      });
  }

  static createComment(content, articleId) {
    axios
      .post('/comment', { content: content, articleId: articleId })
      .then(result => {
        if (result.status == 201) {
          console.log(result.data);
          return renderComment({
            content: result.data.comment.content,
            creator: result.data.creator.name
          });
        }
      })
      .catch(err => {
        if (err.response) {
          console.log(err);
        }
      });
  }
}
