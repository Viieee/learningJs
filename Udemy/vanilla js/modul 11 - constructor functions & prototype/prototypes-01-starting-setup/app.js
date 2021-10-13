// class ParentClass{
//   constructor(){
//     this.parent = 'parent';
//   }
//     method1(){

//     }
// }
// class Person extends ParentClass{

//   constructor() {
//     super();
//     this.name = 'Vieri';
//     this.age = 21;
//   }
//   greet() {
//     console.log('Hi, my name is ' + this.name + ", i'm " + this.age);
//   }
// }

function Person(){
    this.age = 30;
    this.name = 'Vieri';
    
  }
  
Person.prototype.greet = function(){
  console.log('Hi, my name is '+ this.name + ', i\'m '+this.age);    
}

//assigning new prototype/fallback object into objects that will be created with constructor function
Person.prototype.method2 = function () {};
console.dir(Person);

const prsn = new Person();
prsn.greet();
console.log(prsn);
console.log(new prsn.__proto__.constructor()); // you can make new object like this based on existing object and not a class / constructor function
// console.dir(ParentClass);

const course = { // new object
  title: 'Halo',
  rating: 5
}

console.log(Object.getPrototypeOf(course)); // is the same as accessing __proto__ of an object
Object.setPrototypeOf(course, {
  // ...Object.getPrototypeOf(course),
  printRating: function(){
    console.log(this.rating);
  }
});

course.printRating();

