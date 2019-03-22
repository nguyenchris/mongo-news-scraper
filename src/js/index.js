import $ from 'jquery';
import Scrape from './models/scrape';
import { elements } from './views/elements';

const scrapeArticles = async category => {
  const scrape = new Scrape(category);
  try {
    await scrape.scrapeForArticles();
    return console.log(scrape);
  } catch (err) {
    console.log(err);
  }
};

elements.category.on('click', function(e) {
  let click = $(this);
  if (click.hasClass('category-btn')) {
    const category = click.data('category');
    scrapeArticles(category);
  }
});
