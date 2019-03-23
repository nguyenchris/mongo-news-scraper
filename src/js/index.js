import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';
import { renderArticlesView } from './views/articlesView';

const scrapeArticles = async category => {
  const scrape = new Scrape(category);
  try {
    await scrape.scrapeForArticles();
    renderArticlesView(scrape.scrapes);
  } catch (err) {
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
