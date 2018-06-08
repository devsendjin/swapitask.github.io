document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');

    window.addEventListener('click', outSideClick, true);

    function outSideClick(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'initial';
            if (modalContent.children) {
                while (modalContent.lastChild) {
                    modalContent.removeChild(modalContent.lastChild);
                }
            }
        }
    };

    fetch('https://swapi.co/api/films/')
        .then((response) => {
            if (response.status === 404) {
                return Promise.reject();
            }

            return response.json();
        })
        .then((films) => {
            let filmList = films.results;

            let output = '';
            output += '<ul class="list">'
            filmList.forEach((item, index) => {
                output += `<li class="list__item list__item-title list__js-click" data-id="${index}"> ${item.title}</li>
                            <li>
                                <ul class="">
                                    <li class="list__item"><span class="list__desc">Episode:</span> ${item.episode_id}</li>
                                    <li class="list__item"><span class="list__desc">Description:</span> ${item.opening_crawl}</li>
                                    <li class="list__item"><span class="list__desc">Director:</span> ${item.director}</li>
                                    <li class="list__item"><span class="list__desc">Created:</span> ${item.created}</li>
                                </ul>
                            </li>`
            });
            output += '</ul>';

            document.getElementById('filmList').innerHTML = output;

            return filmList;
        })
        .then((filmList) => {
            const item = document.querySelector('.list');

            item.addEventListener('click', (e) => {
                const hasClass = e.target.classList.contains('list__js-click')

                if (hasClass) {
                    const filmId = e.target.dataset.id;
                    const characterList = filmList[filmId].characters;

                    function openModal() {
                        modal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    };

                    function closeModal() {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'initial';
                    };

                    let characterInfo = '<div class="close__wrapper"><span class="close__btn">&times;</span></div><h3>Characters list:</h3><ul>';
                    characterList.forEach(url => {

                        fetch(url)
                            .then((response) => {
                                if (response.status === 404) {
                                    return Promise.reject();
                                }

                                return response.json();
                            })
                            .then((characterList) => {
                                characterInfo += `<li class="list__item">Name: ${characterList.name}</li>
                                                    <li class="list__item">Gender: ${characterList.gender}</li>`;
;
                                return characterInfo;
                            })
                            .then((characterInfo) => {
                                    characterInfo += '</ul>';
                                    document.querySelector('.modal-content').innerHTML = characterInfo;
                                    const closeBtn = document.querySelector('.close__wrapper');
                                    closeBtn.addEventListener('click', closeModal, true);
                            })
                            .catch(e => e.message);
                    });

                    openModal();
                }
            });
        })
        .catch(e => e.message);
});