import { elements } from './elements';
import $ from 'jquery';
import moment from 'moment';

const appendElement = (elementPath, element) => {
  elementPath.fadeOut(500, function() {
    $(elementPath)
      .append(element)
      .fadeIn(500);
  });
};

export const renderCurrentArticle = (article, image) => {
  const { link, category, title, author } = article;
  let markup = `
        <div class="title-section">
            <div class="container cc-center">
              <div class="text-container">
                <a class="section-title-text w-inline-block">
                  <div class="post-category-text category">${category}</div>
                </a>
                <a href="${link}" class="cur-article-title"><h1 class="h1">${title}</h1></a>
                <div class="post-author-text cc-center">
                  <a class="post-author">${author}</a>
                </div>
              </div>
            </div>
          </div>
          <div class="post-image">
            <div class="container cc-post-image"><a href="${link}"><img
                src="${image}"
                alt="${title}"/></a>
            </div>
          </div>
`;
  appendElement(elements.articlesContainerTop, markup);
};

const renderCommentsForm = id => {
  let markup = `
  <div class="form-area">
    <textarea rows="4" cols="70" name="comment" id="comment" placeholder="Comment"></textarea>
  </div>
  <div>
    <input class="submit-button comment-submit" type="submit" data-_id="${id}" name="submit" value="Add Comment">
  </div>
  `;
  appendElement($('#comment_form'), markup);
};

export const renderComment = comment => {
  const { creator, content, createdAt } = comment;
  // Create Date
  let markup = `
  <div class="comments">
    <div id="comments-container">
      <div class="comment">
        <div class="comment-user"><span class="user-details"><span class="username">${
          creator.name
        } </span><span>
            </span><span>${moment(createdAt).fromNow()}</span></span>
        </div>
        <div class="comment-text">
          ${content}
        </div>
      </div>
    </div>
  </div>
  `;
  appendElement($('.comments-section'), markup);
};

const renderArticles = article => {
  const {
    link,
    image,
    title,
    summary,
    author,
    category,
    comments,
    _id
  } = article;
  let markup = `
              <div class="_3-collection-item w-dyn-item w-col w-col-3">
              <a data-_id="${_id}"class="posts-image w-inline-block"><img
                  src="${image}"
                  alt="${title}"/></a>
              <div class="post-info-text">
                <a class="category-link category">LATEST NEWS / ${category}</a>
                <a href="${link}" class="post-title w-inline-block" target="_blank">
                  <h2 class="h3">${title}</h2>
                </a>
                <a class="post-title w-inline-block summary">
                  <h3 class="h4">${summary}</h3>
                </a>
                <div class="post-author-text cc-small-thumbnail">
                  <div class="post-author cc-top-margin">By</div>
                  <a class="post-author">${author}</a>
                </div>
              </div>
                <div class="comments-view">
                  <div class="post-author all-comments" data-_id="${_id}">
                    <span id="comments-num">${comments.length}</span>  Comments
                </div>
              <div class="post-author">
                <div class="view-comments" data-_id="${_id}">
                  View Comments
                </div>
                </div>
              </div>
            </div>
  `;
  appendElement(elements.articlesContainerTop, markup);
};

export const createBackButton = () => {
  let markup = `
    <a class="w-button back-btn">Back</a>
  `;
  appendElement($('.category-title'), markup);
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

  appendElement(
    $('.pagination-btns'),
    `<div class="page-text">Page ${page} of ${pages}</div>`
  );
  appendElement($('.pagination-btns'), finalButton);

  appendElement($('.footer-pagination'), finalButton);
  appendElement(
    $('.footer-pagination'),
    `<div class="page-text">Page ${page} of ${pages}</div>`
  );
};

const renderHeaders = (category, totalArticles) => {
  $('.category-title').text(`LATEST NEWS / ${category}`);
  $('.num-articles').text(`Total Articles: ${totalArticles}`);
};

export const resetHeaders = () => {
  $('.category-title').empty();
  $('.num-articles').empty();
};

export const resetPagination = () => {
  elements.paginationWrap.empty();
  elements.footerPagination.empty();
};

export const resetComments = () => {
  $('.comments-section').empty();
  $('#comment_form').empty();
};

export const renderCommentsView = (comments, id) => {
  const commentSection = $('.comments-section');
  commentSection.append('<h4>COMMENTS</h4>');
  if (comments.length > 0) {
    comments.forEach(el => {
      renderComment(el, id);
    });
  }
  renderCommentsForm(id);
};

export const renderArticlesView = (
  articles,
  page = 1,
  totalArticles,
  category
) => {
  if (totalArticles > 9) {
    renderButtons(page, totalArticles, 9);
  }
  articles.forEach(renderArticles);
  renderHeaders(category, totalArticles);
};
