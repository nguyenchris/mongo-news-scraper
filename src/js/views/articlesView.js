import { elements } from './elements';
import $ from 'jquery';

const appendElement = (elementPath, element) => {
  elementPath.fadeOut(500, function() {
    $(elementPath)
      .append(element)
      .fadeIn(500);
  });
};

const renderArticles = article => {
  const { link, image, title, summary, author, category } = article;
  let markup = `
              <div class="_3-collection-item w-dyn-item w-col w-col-3">
              <a href="${link}" class="posts-image w-inline-block" target="_blank"><img
                  src="${image}"
                  alt=""/></a>
              <div class="post-info-text">
                <a href="${link}" class="category-link" target="_blank">${category}</a>
                <a href="${link}" class="post-title w-inline-block" target="_blank">
                  <h2 class="h3">${title}</h2>
                </a>
                <a href="${link}" class="post-title w-inline-block summary" target="_blank">
                  <h3 class="h4">${summary}</h3>
                </a>
                <div class="post-author-text cc-small-thumbnail">
                  <div class="post-author cc-top-margin">By</div>
                  <a href="${link}" class="post-author" target="_blank">${author}</a>
                </div>
              </div>
                <div class="comments">
                  <div class="post-author">
                    <span id="comments-num">0</span>  Comments
                </div>
              <div class="post-author">
                <div class="new-comment">
                  Post Comment
                </div>
                </div>
              </div>
            </div>
  `;
  appendElement(elements.articlesContainerTop, markup);
};

const createButton = (page, type) => {
  return `
    <a class="button w-button page-btn" data-goto="${
      type === 'prev' ? page - 1 : page + 1
    }">${type === 'prev' ? 'prev Page' : 'next page'}</a>
`;
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  console.log(pages);
  console.log(page);
  let button;
  if (page === 1 && pages >= 1) {
    // Only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, 'prev');
  }

  let finalButton = `<div class="page-btn-wrapper">${button}</div>`;

  document.querySelector('.pagination-btns').innerHTML = finalButton;
};

export const renderArticlesView = (articles, page = 1, resPerPage = 9) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  renderButtons(page, articles.length, resPerPage);
  articles.slice(start, end).forEach(renderArticles);
};
