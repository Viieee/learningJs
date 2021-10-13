class Animal {
  x = 12;
  constructor(){
    this.render();
  }

  render(){
    console.log('parent class');
  }
}

class Rabbit extends Animal {
  x = 1;
  constructor(){
    super();
    this.aloha();
  }
  aloha(){
    console.log('aloha!');
    console.log(this.x) // referring into x in rabbit class
  }
  render(){
    console.log('child class');
    console.log(this.x); // referring into x in animal class
  }
}

new Rabbit(); // child class
