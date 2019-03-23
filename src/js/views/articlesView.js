import { elements } from './elements';
import $ from 'jquery';

const appendElement = (elementPath, element) => {
  elementPath.fadeOut(500, function() {
    $(this)
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
                  alt="" sizes="(max-width: 479px) 100vw, (max-width: 767px) 92vw, (max-width: 991px) 46vw, 22vw"
                  srcset="${image} 500w, ${image} 800w, ${image} 1080w, ${image} 1600w, ${image} 1700w" /></a>
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
            </div>
  `;
  appendElement(elements.articlesContainerTop, markup);
};

const renderArticle = article => {
  const { link, image, title, summary, author } = article;
  let markup = `
<div class="_2-collection-item w-dyn-item w-col w-col-6">
  <a href="${link}" class="posts-image w-inline-block" target="_blank"><img
      src="${image}"
      alt="" sizes="(max-width: 479px) 96vw, (max-width: 767px) 92vw, 46vw"
      srcset="${image} 500w, ${image} 800w, ${image} 1080w, ${image} 1600w, ${image} 1700w" /></a>
  <div class="post-info-text">
    <a href="${link}" class="category-link" target="_blank">${title}</a>
    <a href="${link}" class="post-title w-inline-block" target="_blank">
      <h2 class="h3">${summary}</h2>
    </a>
    <div class="post-author-text cc-small-thumbnail">
      <div class="post-author cc-top-margin">By</div>
      <a href="${link}" class="post-author" target="_blank">${author}</a>
    </div>
  </div>
</div>
`;
  appendElement(elements.articlesContainer, markup);
};

export const renderArticlesView = articles => {
  articles.forEach(renderArticles);
};
