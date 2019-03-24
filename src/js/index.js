import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';
import { renderArticlesView } from './views/articlesView';
import { renderLoader, clearLoader } from './views/loader-view';

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
