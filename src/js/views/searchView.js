class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInputField();
    return query;
  }

  _clearInputField() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();

      const searchResults =
        e.target.parentElement.parentElement.querySelector('.search-results');

        // Responsive Phono
      getComputedStyle(searchResults).order === '3' &&
        searchResults.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

export default new SearchView();
