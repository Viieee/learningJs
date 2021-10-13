const ADD_MODAL_ELEMENT = document.getElementById('add-modal');
// Alternative ways
// const ADD_MODAL = document.querySelector('#add-modal');
// const ADD_MODAL = document.body.children[1];

const START_ADD_BUTTON = document.querySelector('header button');
// Alternative ways
// const START_ADD_BUTTON = document.querySelector('header').lastElementChild;
// const ADD_MODAL = document.querySelector('header').children[1];

const BACKDROP_ELEMENT = document.getElementById('backdrop');
// Alternative ways
// const BACKDROP_ELEMENT = document.body.firstElementChild;

// button pada modal add
// cancel button
const CANCEL_ADD_MODAL_BUTTON = ADD_MODAL_ELEMENT.querySelector('.btn--passive');
// Alternative ways
// const CANCEL_ADD_MODAL_BUTTON = ADD_MODAL_ELEMENT.lastElementChild.firstElementChild;

// add button
const CONFIRM_ADD_MODAL_BUTTON = ADD_MODAL_ELEMENT.querySelector('.btn--success');
// Alternative ways
// const CONFIRM_ADD_MODAL_BUTTON = ADD_MODAL_ELEMENT.lastElementChild.lastElementChild;
// const CONFIRM_ADD_MODAL_BUTTON = CANCEL_ADD_MODAL_BUTTON.nextElementSibling;

const userInputs = ADD_MODAL_ELEMENT.querySelectorAll('input');
// Alternative ways
// const userInputs = ADD_MODAL_ELEMENT.getElementsByTagName('input');

const entryTextSection = document.getElementById('entry-text');

const deleteMovieModal = document.getElementById('delete-modal');

//query button deletion
const CANCEL_DELETION_BUTTON = deleteMovieModal.querySelector('.btn--passive');
let CONFIRM_DELETION_BUTTON = deleteMovieModal.querySelector('.btn--danger');

// storing the inputs inside an array
const movies = [];

function updateUI(){
    if(movies.length === 0){
        entryTextSection.style.display='block';
    }else{
        entryTextSection.style.display='none';
    }
}

function renderNewElement(movieId, title, imageUrl, rating){
    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element';
    newMovieElement.innerHTML = `
    <div class="movie-element__image">
        <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
        <h2>${title}</h2>
        <p>${rating}/5</p>
    </div>
    `;
    newMovieElement.addEventListener('click',startDeletionModal.bind(null, movieId));
    const unorderedList = document.getElementById('movie-list');
    unorderedList.append(newMovieElement);
}

function clearMovieInput(){
    for(const loopInput of userInputs){
        loopInput.value ='';
    }
}

function deleteMovieHandler(movieId){
    let movieIndex = 0;
    // finding index movie to delete
    for(const movie of movies){
        if(movie.id===movieId){
            break;
        }
        movieIndex++;
    }
    movies.splice(movieIndex,1);
    const unorderedList = document.getElementById('movie-list');
    unorderedList.children[movieIndex].remove();
    closeDeletion();
    // alternative ways
    // unorderedList.removeChild(unorderedList.children[movieIndex]);
    updateUI();
}

// button functions
function addBackdrop(){
    BACKDROP_ELEMENT.classList.add('visible');
}

function removeBackdrop(){
    BACKDROP_ELEMENT.classList.remove('visible');
}

function backdropClick(){
    closeModal();
    closeDeletion();
}

function showModal(){
    ADD_MODAL_ELEMENT.classList.add('visible'); 
    addBackdrop();
}

function closeModal(){
    ADD_MODAL_ELEMENT.classList.remove('visible'); 
    clearMovieInput();
    removeBackdrop();
}

function cancelAddModal(){
    closeModal();
}

function closeDeletion(){
    removeBackdrop();
    deleteMovieModal.classList.remove('visible');
}

function startDeletionModal(movieId){
    deleteMovieModal.classList.add('visible');
    addBackdrop();
    // kalau menggunakan bind gunakan ini!
    // recreate the deletion button
    CONFIRM_DELETION_BUTTON.replaceWith(CONFIRM_DELETION_BUTTON.cloneNode(true));
    CONFIRM_DELETION_BUTTON = deleteMovieModal.querySelector('.btn--danger');
    // hapus biasa gunakan ini
    CANCEL_DELETION_BUTTON.removeEventListener('click', closeDeletion);

    CANCEL_DELETION_BUTTON.addEventListener('click', closeDeletion);
    CONFIRM_DELETION_BUTTON.addEventListener('click', deleteMovieHandler.bind(null, movieId));
    // deleteMovie(movieId);
}

function confirmAddModal(){
    const titleValue = userInputs[0].value; 
    const imageUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;

    if(titleValue.trim() === '' ||
    imageUrlValue.trim() === '' ||
    ratingValue.trim() === '' ||
    +ratingValue < 1 ||
    +ratingValue > 5 ){ //trim removing excess whitespaces, + before var converting it to a integer/number
        alert('Please enter valid values!');
        return;
    }

    const newMovieInput = {
        id: Math.random(),
        title: titleValue,
        image: imageUrlValue,
        rating: ratingValue
    };

    movies.push(newMovieInput);
    console.log(movies);
    closeModal();
    renderNewElement(newMovieInput.id, newMovieInput.title, newMovieInput.image, newMovieInput.rating);
    updateUI();
    clearMovieInput();
}

CANCEL_ADD_MODAL_BUTTON.addEventListener('click',cancelAddModal);
BACKDROP_ELEMENT.addEventListener('click',backdropClick)
START_ADD_BUTTON.addEventListener('click',showModal);
CONFIRM_ADD_MODAL_BUTTON.addEventListener('click',confirmAddModal);

