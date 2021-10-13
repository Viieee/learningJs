const button = document.querySelector('button');
const output = document.querySelector('p');

function getPos(opts){
  const posPromise = new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(success=>{
      resolve(success); 
    },
    error=>{
      reject(error);
    }, opts);
    // argument inside resolve/reject function will be passed into the then/catch method 
  });
  return posPromise;
}


function setTimer(duration){
  // function inside the Promise class argument will be executed right away when the promise object is created 
  const promise = new Promise((resolve, reject)=>{ // resolve and reject is a function
    setTimeout(()=>{
      resolve('Done!'); // executed by browser
    },duration);
  });
  return promise;
}

/* 
  function trackUserHandler() {
    ! without promise
    navigator.geolocation.getCurrentPosition(
      posData => {
        // setTimeout(() => {
        //   console.log(posData);
        // }, 2000);
        setTimer(2000).then(data=>{
          console.log(data, posData);  
          ? data is the text passed on to our promised above
        })
      },
      error => {
        console.log(error);
      }
    );

    ! with promise
    let positionData;
    getPos()
    .then(posData => {
      ! this code will run if getPos() method is resolved
      positionData = posData;
      ? posData passed into this method from the resolved function in the promise function
      ? we use position data (a varaible inside this trackuserHandler function) to pass around data into 
      ? chained 'then' method
      return setTimer(2000);
      ? if we do this (returning a promise)
      ? the setTimer promise function will execute once the code in this 'then' method is done
      ? if we passing something other than a promise (e.g string), the data passed into the then chained after this will reflect the string we returned
    }).then(data=>{
      ! this will be executed once the setTimer() function is done, this behaviour is caused by us returning a promise in previous then method
      console.log(data, positionData);
    }).catch(error=>{
      ! this catch method will run if any promise prior to this catch is rejected
      ! in this case if i block location permission on browser, the then method after getPos() and before this catch method won't run and skipped to this catch method
      console.log(error);
    });
*/

async function trackUserHandler() {
  let posData;
  let timerData;
  try{
    posData = await getPos();
    timerData = await setTimer(2000);
  }catch(error){
    console.log(error);
  }
  console.log(timerData, posData);
}

button.addEventListener('click', trackUserHandler);