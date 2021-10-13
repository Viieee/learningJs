// membuat logika menggunakan multiple class dan menerapkan inheritance

// tampung struktur dari object person
class Person{
    constructor(name, age, sex, location){
        // creating new properties
        // and providing custom initialization
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.location = location;
    }
}

// parent class, to implement inheritance
class TambahUmur{
    // receiving data from initialization
    constructor (age,addedAge){
        // creating new property called umur inside this class
        this.age = age;
        this.addedAge = addedAge
    }
    tambah(){
        const totalUmur = this.age + this.addedAge;
        console.log(totalUmur);
    }
}

// daftar dari semua person yang ada
class PersonList{

    // initializing Person class 
    persons = [
        new Person('Vieri Adhitya', 21, 'M', 'Semarang'),
        new Person('Tyler The Creator', 29, 'M', 'California'),
        new Person('Maya Jama', 26, 'F', 'London')
    ];

    loggingNewAge(){ // akan melakukan instansiasi class OnePerson ke setiap data yang ada di array persons
        for(const person of this.persons){
            const onePerson = new OnePerson(person, person.age, 5); // argumen yang dimasukkan adalah argumen yang diminta di constructor class OnePerson
            onePerson.output();
        }
    }
}

class OnePerson extends TambahUmur{
    // person, age, dan addedAge adalah data yang diambil/menjadi argumen saat instansiasi class
    constructor(person, age, addedAge){
        super(age,addedAge); // mengumpan data ke parent class
        this.person = person; 
    }
    output(){
        const newAge = this.tambah(); // karena OnePerson melakukan inheritance terhadap class TambahUmur, maka class ini memiliki akses ke method yang ada di class
                                      // TambahUmur yaitu method tambah()
    }
}

const baru = new PersonList(); // instansiasi class PersonList
baru.loggingNewAge();
