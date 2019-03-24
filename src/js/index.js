import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';
import { renderArticlesView } from './views/articlesView';
import { renderLoader, clearLoader } from './views/loader-view';
import User from './models/user';
import { invalidCredentials } from './views/errorViews';

const scrapeArticles = async category => {
  const scrape = new Scrape(category);
  elements.articlesContainerTop.empty();
  renderLoader(elements.articlesContainerTop);
  try {
    await scrape.scrapeForArticles();
    clearLoader();
    renderArticlesView(scrape.scrapes);
  } catch (err) {
    elements.articlesContainerTop.empty();
    console.log(err);
  }
};

// const getArticles =

elements.category.on('click', function(e) {
  let click = $(this);
  if (click.hasClass('category-btn')) {
    const category = click.data('category');
    return scrapeArticles(category);
  }
});

elements.formSubmit.on('click', function(e) {
  e.preventDefault();
  let login;
  const isLogin = $(this)
    .parents()
    .hasClass('form-login');
  const isSignup = $(this)
    .parents()
    .hasClass('form-signup');
  const user = {
    email: elements.formEmail.val().trim(),
    password: elements.formPassword.val().trim()
  };
  if (user.email.indexOf('@') == -1 || user.email.length < 3) {
    return invalidCredentials('Enter a valid email');
  }
  if (user.password.length < 5) {
    return invalidCredentials('Invalid email or password');
  }

  if (isLogin) {
    return User.loginUser(user);
  } else {
    user.name = elements.formName.val().trim();
    if (user.name.length < 3) {
      return invalidCredentials('Enter a valid name');
    }
    if (user.password !== elements.formConfirm.val().trim()) {
      return invalidCredentials('Passwords must match');
    }
    return User.signupUser(user);
  }
});
