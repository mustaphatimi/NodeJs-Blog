document.addEventListener('DOMContentLoaded', function () {

    const searchBtns = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput')
    const closeBtn = document.getElementById('searchClose')

    for (let button of searchBtns) {
        button.addEventListener('click', function () {
            searchBar.style.visibility = 'visible'
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', true)
            searchInput.focus()
        })
    }
    closeBtn.addEventListener('click', function () {
        searchBar.style.visibility = 'hidden'
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', false)
    })
})