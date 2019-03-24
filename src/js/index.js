import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';
import { renderArticlesView } from './views/articlesView';
import { renderLoader, clearLoader } from './views/loader-view';
import User from './models/user';

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

  const isLogin = $(this)
    .parents()
    .hasClass('form-login');
  const isSignup = $(this)
    .parents()
    .hasClass('form-signup');
  const user = new User(
    elements.formName.text().trim(),
    elements.formEmail.text().trim(),
    elements.formPassword.text().trim()
  );
  console.log(user);
  if (isLogin) {
    user.loginUser();
  } else {
    console.log('hi');
  }
});
