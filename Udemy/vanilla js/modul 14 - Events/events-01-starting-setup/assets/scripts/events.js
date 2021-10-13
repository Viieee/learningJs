const button = document.querySelector('button')

function buttonHandler(ev){
    console.log(ev);
}
button.addEventListener('click', buttonHandler);
