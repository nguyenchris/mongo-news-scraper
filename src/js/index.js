import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';
import { renderArticlesView, resetHeaders } from './views/articlesView';
import { renderLoader, clearLoader } from './views/loader-view';
import User from './models/user';
import Article from './models/article';
import { invalidCredentials, ajaxError } from './views/errorViews';

const state = {};

// Scrape for new articles
const scrapeArticles = async category => {
  const scrape = new Scrape(category);
  resetHeaders();
  elements.paginationWrap.empty();
  elements.articlesContainerTop.empty();
  renderLoader(elements.articlesContainerTop);
  try {
    await scrape.scrapeForArticles();
    getArticles(category, 1, true);
  } catch (err) {
    elements.articlesContainerTop.empty();
    clearLoader();
    ajaxError('Unable to get articles.');
    console.log(err);
  }
};

const getArticles = async (category, page, isScrape) => {
  state.article = new Article(category);
  if (!isScrape) {
    elements.articlesContainerTop.empty();
    elements.paginationWrap.empty();
    renderLoader(elements.articlesContainerTop);
    resetHeaders();
  }
  try {
    await state.article.getArticles(page);
    clearLoader();
    console.log(state.article.articles[0]);
    renderArticlesView(
      state.article.articles,
      page,
      state.article.totalArticles,
      state.article.category
    );
  } catch (err) {
    elements.articlesContainerTop.empty();
    elements.paginationWrap.empty();
    clearLoader();
    ajaxError('Unable to get articles.');
    console.log(err);
  }
};

// Listens for which page button was clicked and calls getArticles to render articles
elements.paginationWrap.on('click', function(e) {
  const clickedBtn = $(e.target);
  if (clickedBtn.hasClass('page-btn')) {
    const page = clickedBtn.data('goto');
    getArticles(state.article.category, page);
  }
});

// Determines which cateogry was selected
elements.category.on('click', function(e) {
  let click = $(this);
  if (click.hasClass('category-btn')) {
    const category = click.data('category');
    return scrapeArticles(category);
  }
});

// Keyup listener for submitting login/signup form
$('.form-wrap').keyup(function(e) {
  e.preventDefault();
  const keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode == '13') {
    const isLogin = $(this)
      .children()
      .hasClass('form-login');
    checkForm(isLogin);
  }
});

// Click listener for login/submit form
elements.formSubmit.on('click', function(e) {
  e.preventDefault();
  const isLogin = $(this)
    .parents()
    .hasClass('form-login');
  checkForm(isLogin);
});

// Checks which form is being submitted and validates input before sending request
function checkForm(isLogin) {
  const user = {
    email: elements.formEmail.val().trim(),
    password: elements.formPassword.val().trim()
  };
  if (
    user.email.indexOf('@') == -1 ||
    user.email.length < 3 ||
    user.email.indexOf('.') == -1
  ) {
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
}
