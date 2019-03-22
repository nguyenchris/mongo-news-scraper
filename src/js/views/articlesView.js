import { elements } from './elements';

export const renderArticles = () => {
  let markup = `
              <div class="_4-collection-item w-dyn-item w-col w-col-3">
              <a href="" class="posts-image w-inline-block"><img
                  src="${image}"
                  alt="" sizes="(max-width: 479px) 100vw, (max-width: 767px) 92vw, (max-width: 991px) 46vw, 22vw"
                  srcset="${image} 500w, ${image} 800w, ${image} 1080w, ${image} 1600w, ${image} 1700w" /></a>
              <div class="post-info-text">
                <a href="${link}" class="category-link">${title}</a>
                <a href="${link}" class="post-title w-inline-block">
                  <h2 class="h3">${summary}</h2>
                </a>
                <div class="post-author-text cc-small-thumbnail">
                  <div class="post-author cc-top-margin">By</div>
                  <a href="${link}" class="post-author">${author}</a>
                </div>
              </div>
            </div>
  `;
};
