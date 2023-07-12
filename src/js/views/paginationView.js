import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.gotopage;

      handler(goToPage);
    });
  }

  _generatorMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    const curPage = this._data.page;

    // First page and there Other page
    if (curPage === 1 && numPages > 1) {
      return (
        this._generatorMarkupNextPage(curPage) +
        this._generatorMarkupNumPages(numPages)
      );
    }

    // Last page and there Other page
    if (curPage === numPages && numPages > 1) {
      return (
        this._generatorMarkupPrevPage(curPage) +
        this._generatorMarkupNumPages(numPages)
      );
    }

    // Other page
    if (curPage > 1) {
      return (
        this._generatorMarkupNextPage(curPage) +
        this._generatorMarkupPrevPage(curPage) +
        this._generatorMarkupNumPages(numPages)
      );
    }

    // One page
    return '';
  }

  _generatorMarkupNextPage(curPage) {
    return `
      <button data-gotopage='${
        curPage + 1
      }' class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  _generatorMarkupPrevPage(curPage) {
    return `
      <button data-gotoPage='${
        curPage - 1
      }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
  }

  _generatorMarkupNumPages(numPages) {
    return `
      <p class="num-pages">${numPages} Pages</p>
    `;
  }
}

export default new PaginationView();
