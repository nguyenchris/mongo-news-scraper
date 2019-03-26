import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';
import {
  renderArticlesView,
  resetHeaders,
  resetPagination,
  createBackButton,
  renderCurrentArticle,
  renderCommentsView,
  resetComments,
  renderComment
} from './views/articlesView';
import { renderLoader, clearLoader } from './views/loader-view';
import User from './models/user';
import Article from './models/article';
import { invalidCredentials, ajaxError } from './views/errorViews';

// Global state
const state = {};

// Calls API to get all articles stored in database and renders to ui
const getArticles = async (category, page, isScrape) => {
  state.article = new Article(category, page);
  if (!isScrape) {
    resetPagination();
    resetHeaders();
    elements.articlesContainerTop.empty();
    renderLoader(elements.articlesContainerTop);
  }
  resetComments();
  try {
    await state.article.getArticles(page);
    clearLoader();
    console.log('STATE', state.article.articles);
    renderArticlesView(
      state.article.articles,
      page,
      state.article.totalArticles,
      state.article.category
    );
  } catch (err) {
    elements.articlesContainerTop.empty();
    resetPagination();
    resetHeaders();
    clearLoader();
    ajaxError('Unable to get articles.');
    console.log(err);
  }
};

// Scrape for new articles
const scrapeArticles = async category => {
  const scrape = new Scrape(category);
  resetHeaders();
  resetPagination();
  resetComments();
  elements.articlesContainerTop.empty();
  renderLoader(elements.articlesContainerTop);
  try {
    await scrape.scrapeForArticles();
    getArticles(category, 1, true);
  } catch (err) {
    elements.articlesContainerTop.empty();
    resetHeaders();
    resetPagination();
    clearLoader();
    ajaxError('Unable to get articles.');
    console.log(err);
  }
};

const getChosenArticleView = id => {
  resetHeaders();
  resetPagination();
  elements.articlesContainerTop.empty();
  const chosenArticle = state.article.articles.find(obj => {
    return obj._id == id;
  });
  let image = chosenArticle.image;
  let modImage = '';
  image.includes('threeByTwoSmallAt2X')
    ? (modImage = image.replace('threeByTwoSmallAt2X', 'threeByTwoMediumAt2X'))
    : (modImage = image);
  createBackButton();
  renderCurrentArticle(chosenArticle, modImage);
  console.log(chosenArticle.comments);
  renderCommentsView(chosenArticle.comments, id);
};

elements.commentForm.on('click', '.comment-submit', function(e) {
  const _id = $(this).data('_id');
  const commentText = $('#comment_form')
    .children('.form-area')
    .children('#comment')
    .val()
    .trim();
  if (commentText == '') {
    return;
  }
  User.createComment(commentText, _id);
  // renderComment(commentText);
});

// Listens for which page button was clicked and calls getArticles to render articles
elements.pagination.on('click', function(e) {
  const clickedBtn = $(e.target);
  if (clickedBtn.hasClass('page-btn')) {
    const page = clickedBtn.data('goto');
    getArticles(state.article.category, page);
  }
});

// Determines which category was selected
elements.category.on('click', function(e) {
  let click = $(this);
  if (click.hasClass('category-btn')) {
    const category = click.data('category');
    scrapeArticles(category);
  }
});

elements.articlesContainerTop.on(
  'click',
  '.view-comments, .all-comments, .category',
  function(e) {
    let event = $(this);
    if (event.hasClass('view-comments') || event.hasClass('all-comments')) {
      const _id = event.data('_id');
      return getChosenArticleView(_id);
    }
    if (event.hasClass('category')) {
      return scrapeArticles(event.text().trim());
    }
  }
);

$('.category-title').on('click', function(e) {
  elements.articlesContainerTop.empty();
  resetPagination();
  resetHeaders();
  resetComments();
  getArticles(state.article.category, state.article.page);
  // renderArticlesView(
  //   state.article.articles,
  //   state.article.page,
  //   state.article.totalArticles,
  //   state.article.category
  // );
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
