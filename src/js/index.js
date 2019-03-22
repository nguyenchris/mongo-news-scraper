import $ from 'jquery';
import Scrape from './models/scrape';

const scrapeArticles = async () => {
  const scrape = new Scrape('hi');
  try {
    await scrape.scrapeForArticles();
    return console.log(scrape);
  } catch (err) {
    console.log(err);
  }
};

getTestResult();
