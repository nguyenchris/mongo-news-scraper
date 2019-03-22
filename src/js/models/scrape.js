import axios from 'axios';

export default class Scrape {
  constructor(category) {
    this.category = category;
  }

  async scrapeForArticles() {
    try {
      const res = await axios(`/api/scrape/${category}`);
      this.scrapes = res.data;
    } catch (error) {
      console.log(error);
    }
  }
}
