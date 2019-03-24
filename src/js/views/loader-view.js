import $ from 'jquery';
import { elements } from './elements';

export const renderLoader = parent => {
  const loader = `   
      <div class="loader">
        <img src="/img/tail-spin.svg" alt="">
      </div>
    `;
  parent.append(loader);
};

export const clearLoader = () => {
  elements.articlesContainerTop.children('.loader').remove();
};
