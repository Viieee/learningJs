// function powerOf(x,n){
//     let result = 1;
//     for(let i = 0; i<n;i++){
//         return result *= x;
//     }
//     return result;
// }

// console.log(powerOf(2,3)) // 2*2*2 = 8

// with recursion, same as:

function powerOf(x,n){
    if(n===1){
        return x;
    }
    return x*powerOf(x, n-1);
}

console.log(powerOf(2,3)) // 2*2*2 = 8
