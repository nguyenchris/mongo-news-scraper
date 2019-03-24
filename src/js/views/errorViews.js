import $ from 'jquery';
import { elements } from './elements';

export const invalidCredentials = err => {
  elements.formFail.css('display', 'block').empty();
  elements.formFail.append(`<div>${err}</div>`);
};
