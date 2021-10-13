const ulRef = document.querySelector('ul'); //akan menunjuk ke ul pertama yang ada di urutan code

const liRef = document.querySelector('li');

// cara mengganti styling css menggunakan js
const section = document.querySelector('section');
const button = document.querySelector('button');

section.className = 'red-bg'; // mengassign nama class pada section

// jika diclick akan mentoggle class invisible pada element section
button.addEventListener('click', () => {
  // if (section.className === 'red-bg visible') {
  //   section.className = 'red-bg invisible';
  // } else {
  //   section.className = 'red-bg visible';
  // }

  // section.classList.toggle('visible');
  section.classList.toggle('invisible');
});

// beforebegin berarti sebelum element yang direference
section.insertAdjacentHTML('beforebegin', '<p>add element melalui js menggunakan insertAdjacentHTML beforebegin</p>');
// afterbegin berarti dalam element sebelum first child
section.insertAdjacentHTML('afterbegin', '<p>add element melalui js menggunakan insertAdjacentHTML afterbegin</p>');
// beforeend berarti dalam element setelah last child
section.insertAdjacentHTML('beforeend', '<p>add element melalui js menggunakan insertAdjacentHTML beforeend</p>');
// afterend berarti setelah element
section.insertAdjacentHTML('afterend', '<p>add element melalui js menggunakan insertAdjacentHTML afterend</p>');

const newLi = document.createElement('li'); // akan membuat element li
newLi.textContent = 'Item baru';
ulRef.append(newLi); //newLi adalah object
ulRef.prepend(newLi);
ulRef.lastElementChild.before(newLi); // li yang baru akan diletakan sebelum li terakhir yang ada di ul
ulRef.firstElementChild.after(newLi); // li yang baru akan diletakan setelah li pertama yang ada di ul

// NOTE: penggunaan method prepend, append, before, dan after tidak bisa digunakan secara bersamaan ke 1 objek argumen
// line code terakhir adalah line yang akan diemplementasikan bila argumennya sama


