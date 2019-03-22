import axios from 'axios';

export default class Search {
  constructor(query) {
      this.query = query;
  }

  async getTest() {
      try {
          const res = await axios('/api/test');
          this.test = res.data
          
      } catch (error) {
          alert(error);
      }
  }
}