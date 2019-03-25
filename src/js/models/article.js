import axios from 'axios';

export default class Article {
  constructor(category) {
    this.category = category;
  }
  async getArticles(pageNum) {
    if (!pageNum) return (pageNum = '');
    try {
      const res = await axios(`/news/${this.category}?page=${pageNum}`);
      console.log('AJAX', res.data.articles);
      this.articles = res.data.articles;
      this.totalArticles = res.data.totalArticles;
      console.log(this.articles);
    } catch (error) {
      console.log(error);
    }
  }
}
