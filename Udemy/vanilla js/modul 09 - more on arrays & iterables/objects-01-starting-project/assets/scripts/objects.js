// buttons
const addMovieButton = document.getElementById('add-movie-btn');
const filterMovieButton = document.getElementById('search-btn');

let movies = [];

const movieList = document.getElementById('movie-list');

// function
function renderMovies(filter = ''){ // default value
    
    if(movies.length===0){
        movieList.classList.remove('visible')
        return;
    }else{
        movieList.classList.add('visible')
    }
    
    // ternary condition
    // if the filter is indeed falsy/empty then all the movies will be shown
    // if the filter is truthy then use filter()
    const filteredMovies = !filter ? movies : movies.filter(function(element){
        return element.info.title.includes(filter); // akan mereturn hasil dari isi array yang mengandung elemen filter
    }); 
    
    movieList.innerHTML=''; // akan mereset value yang ada dibawah movieList di HTML code
                            // akan memastikan bahwa movieList akan di re-create setiap button dipencet
    
    
    // untuk tiap elemen movie
    filteredMovies.forEach(function(movie){ //bertanggung jawab untuk membuat element li dan mengisi kedalam movielist
        const movieElement = document.createElement('li');
        const {info, ...otherProperties} = movie; // info akan menggantikan movie.info
        let {getFormattedTitle} = movie; // akan menggantikan movie.getFormattedTitle()
        getFormattedTitle = getFormattedTitle.bind(movie); // akan memaksa 'this' pada getFormattedTitle untuk merefer ke movie 
                                                             // bisa juga menggunakan getFormattedTitle.call(movie)
                                                             // argumen pada call() digunakan untuk mengoverride this pada function  
                                                             // argumen setelah argumen pertama adalah list item yang dipisahkan ,
                                                             // apply()  sama seperti call tapi argumen kedua adalah array
        let text = getFormattedTitle() + ' - ' // getFormatedTitle menggantikan movie.info.title, movie.info.title disebut chaining
        // for in loop for objects, going through all key-value pair in an object
        for (const key in info){  //untuk set text content
            if(key !== 'title'){ // mengexclude property title dalam object info
                text += `${key}: ${info[key]}`; // ${key} will be the key inside info object in newMovie object
            }                                         // ${movie.info[key]} is the value of the property key
        }
        movieElement.textContent = text;
        movieList.append(movieElement);
    })
}


// button function
function addMovieHandler(){
// user inputs
const title = document.getElementById('title').value;
const extraName = document.getElementById('extra-name').value;
const extraValue = document.getElementById('extra-value').value;
    if(title.trim() === ''||
    extraName.trim() === '' ||
    extraValue.trim() === ''){
        return;
    }
    const newMovie ={
        info : {
            title: title, // if the key name and value name is the same, you can just write it once
            [extraName]: extraValue
        }, 
        id: Math.random(),
        getFormattedTitle: function(){
            return this.info.title.toUpperCase(); // this pada line ini merefer ke object newMovie
        }
    }
    movies.push(newMovie);
    console.log(newMovie, movies);
    renderMovies();
}

function searchMovieHandler(){
    const filterInput = document.getElementById('filter-title').value;
    renderMovies(filterInput);
}

addMovieButton.addEventListener('click',addMovieHandler);
filterMovieButton.addEventListener('click',searchMovieHandler);