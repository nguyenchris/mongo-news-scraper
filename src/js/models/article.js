import axios from 'axios';

export default class Article {
  constructor(category) {
    this.category = category;
  }
  async getArticles(pageNum) {
    if (!pageNum) pageNum = '';
    try {
      const res = await axios(`/news/${this.category}?page=${pageNum}`);
      this.articles = res.data.articles;
      this.totalArticles = res.data.totalArticles;
    } catch (error) {
      console.log(error);
    }
  }
}
