import $ from 'jquery';
import Search from './models/search';

const getTestResult = async () => {
  const search = new Search('hi')
  try {
    await search.getTest()
    return console.log(search)
  } catch (err) {
    console.log(err);
  }
}

getTestResult()