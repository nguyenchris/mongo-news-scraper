import axios from 'axios';
import { throws } from 'assert';

export default class Article {
  constructor(category, page) {
    this.category = category;
    this.page = page;
  }
  async getArticles(pageNum) {
    try {
      const res = await axios(`/news/${this.category}?page=${pageNum}`);
      console.log('AJAX', res.data.articles);
      this.articles = res.data.articles;
      this.totalArticles = res.data.totalArticles;
    } catch (error) {
      console.log(error);
    }
  }
}
