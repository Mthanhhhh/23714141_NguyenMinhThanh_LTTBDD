// 1. Create a class Person with attributes name and age. Write a method to display this information.
class Person {
    constructor(public name: string, public age: number) {}
    display(): void {
      console.log(`[Bài 1] Name: ${this.name}, Age: ${this.age}`);
    }
}
const p = new Person("Minh Thanh", 21);
p.display();

// 2. Write a class Student extending Person with an additional attribute grade. Add a method to display all info.
class Student extends Person {
    constructor(name: string, age: number, public grade: string) {
      super(name, age);
    }
    displayAllInfo(): void {
      console.log(`[Bài 2] Name: ${this.name}, Age: ${this.age}, Student ID/Grade: ${this.grade}`);
    }
}
const student = new Student("Nguyễn Minh Thành", 21, "23714141");
student.displayAllInfo();
// 3. Create a class Car with properties brand, model, year. Write a method to show car info.
class Car {
    constructor(public brand: string, public model: string, public year: number) {}
    showInfo(): void {
      console.log(`[Bài 3] Car Info: ${this.year} ${this.brand} ${this.model}`);
    }
}
const myCar = new Car("Honda", "Civic", 2023);
myCar.showInfo();
// 4. Create a class Rectangle with width and height. Write a method to calculate area and perimeter.
class Rectangle {
    constructor(public width: number, public height: number) {}
    getArea(): number { return this.width * this.height; }
    getPerimeter(): number { return 2 * (this.width + this.height); }
}
const rect = new Rectangle(5, 10);
console.log(`[Bài 4] Rectangle Area: ${rect.getArea()}, Perimeter: ${rect.getPerimeter()}`);

// 5. Create a class BankAccount with balance. Add methods deposit() and withdraw().
  class BankAccount {
    constructor(public balance: number = 0) {}
    deposit(amount: number): void { this.balance += amount; }
    withdraw(amount: number): void {
      if (amount <= this.balance) this.balance -= amount;
    }
}
const acc = new BankAccount(500);
acc.deposit(200);
acc.withdraw(100);
console.log(`[Bài 5] Account Balance: ${acc.balance}`);

// 6. Create a class Book with attributes title, author, year.
class Book {
    constructor(public title: string, public author: string, public year: number) {}
  }
  const book1 = new Book("Clean Architecture", "Robert C. Martin", 2017);
  console.log(`[Bài 6] Book: ${book1.title} by ${book1.author}`);

// 7. Write a class User with private property name and getter/setter.
class User {
    private _name: string;
    constructor(name: string) { this._name = name; }
    get name(): string { return this._name; }
    set name(newName: string) { this._name = newName; }
  }
  const user1 = new User("Thanh");
  user1.name = "Nguyen Minh Thanh";
  console.log(`[Bài 7] User name updated via setter: ${user1.name}`);
  
// 8. Create a Product class with name, price. Create an array of products and filter products with price > 100.
class Product {
    constructor(public name: string, public price: number) {}
  }
  const products: Product[] = [
    new Product("Bàn phím cơ", 150),
    new Product("Chuột máy tính", 50),
    new Product("Màn hình", 300)
  ];
  const filtered = products.filter(p => p.price > 100);
  console.log(`[Bài 8] Products > 100:`, filtered.map(p => p.name));

// 9. Define an interface Animal with name and method sound().
interface AnimalInterface {
    name: string;
    sound(): void;
  }
  const myBird: AnimalInterface = {
    name: "Parrot",
    sound: () => console.log(`[Bài 9] Squawk!`)
  };
  myBird.sound();

// 10. Create a class Account with public, private and readonly fields.
class DetailedAccount {
    public id: number;
    private secretKey: string;
    readonly createdAt: Date;
  
    constructor(id: number, secretKey: string) {
      this.id = id;
      this.secretKey = secretKey;
      this.createdAt = new Date();
    }
    showId(): void { console.log(`[Bài 10] Public ID: ${this.id}, Created: ${this.createdAt.toDateString()}`); }
  }
  const dAcc = new DetailedAccount(101, "super_secret");
  dAcc.showId();

// 11. Create a base class Animal. Extend Dog and Cat classes with methods bark() and meow().
class BaseAnimal {}
class Dog extends BaseAnimal { bark(): void { console.log("[Bài 11] Dog: Woof!"); } }
class Cat extends BaseAnimal { meow(): void { console.log("[Bài 11] Cat: Meow!"); } }
new Dog().bark();
new Cat().meow();

// 12. Define interfaces Flyable and Swimmable. Implement them in Bird and Fish classes.
interface Flyable { fly(): void; }
interface Swimmable { swim(): void; }
class Bird implements Flyable { fly(): void { console.log("[Bài 12] Bird is flying"); } }
class Fish implements Swimmable { swim(): void { console.log("[Bài 12] Fish is swimming"); } }
new Bird().fly();
new Fish().swim();

// 13. Create an abstract class Shape with method area(). Implement Square and Circle.
abstract class AbstractShape {
    abstract area(): number;
  }
  class Square extends AbstractShape {
    constructor(public side: number) { super(); }
    area(): number { return this.side * this.side; }
  }
  console.log(`[Bài 13] Square area: ${new Square(4).area()}`);

// 14. Create a base class Employee. Extend Manager and Developer with specific methods.
class Employee { constructor(public name: string) {} }
class Developer extends Employee { code(): void { console.log(`[Bài 14] ${this.name} is coding TypeScript.`); } }
new Developer("Thanh").code();

// 15. Create a Library class that can store Book and User objects. Add method to add books.
class Library {
    books: Book[] = [];
    addBook(b: Book): void { this.books.push(b); }
  }
  const lib = new Library();
  lib.addBook(book1);
  console.log(`[Bài 15] Library has ${lib.books.length} book(s).`);

// 16. Create a generic class Box that can store any type of value.
class Box<T> {
    constructor(public value: T) {}
  }
  const stringBox = new Box<string>("Hello Generics");
  console.log(`[Bài 16] Generic Box contains: ${stringBox.value}`);

// 17. Write a singleton Logger class that logs messages to console.
class Logger {
    private static instance: Logger;
    private constructor() {}
    static getInstance(): Logger {
      if (!Logger.instance) Logger.instance = new Logger();
      return Logger.instance;
    }
    log(msg: string): void { console.log(`[Bài 17] LOG: ${msg}`); }
  }
  Logger.getInstance().log("Hệ thống khởi động thành công.");

// 18. Create a static class MathUtil with methods add(), subtract(), multiply(), divide().
class MathUtil {
    static add(a: number, b: number): number { return a + b; }
  }
  console.log(`[Bài 18] MathUtil.add(10, 5) = ${MathUtil.add(10, 5)}`);

// 19. Demonstrate method overriding using polymorphism with Animal and subclasses.
class PolyAnimal { makeSound(): void { console.log("[Bài 19] Generic sound"); } }
class PolyDog extends PolyAnimal { makeSound(): void { console.log("[Bài 19] Woof!"); } }
const pet: PolyAnimal = new PolyDog();
pet.makeSound();

// 20. Write a Vehicle interface and implement it in Car and Bike classes.
interface Vehicle { drive(): void; }
class Bike implements Vehicle { drive(): void { console.log("[Bài 20] Bike is riding"); } }
new Bike().drive();

// 21. Create a generic Repository class with methods add(), getAll().
class Repository<T> {
    private items: T[] = [];
    add(item: T): void { this.items.push(item); }
    getAll(): T[] { return this.items; }
  }
  const repo = new Repository<number>();
  repo.add(1); repo.add(2);
  console.log(`[Bài 21] Generic Repo:`, repo.getAll());

// 22. Create a class Stack with push, pop, peek, isEmpty methods.
class Stack<T> {
    private items: T[] = [];
    push(item: T): void { this.items.push(item); }
    pop(): T | undefined { return this.items.pop(); }
  }
  const stack = new Stack<string>();
  stack.push("A");
  console.log(`[Bài 22] Stack popped: ${stack.pop()}`);

// 23. Create an interface Payment with method pay(amount). Implement CashPayment and CardPayment.
interface Payment { pay(amount: number): void; }
class CardPayment implements Payment {
  pay(amount: number): void { console.log(`[Bài 23] Paid ${amount} via Card.`); }
}
new CardPayment().pay(500000);

// 24. Create an abstract class Appliance with method turnOn(). Implement Fan and AirConditioner.
abstract class Appliance { abstract turnOn(): void; }
class Fan extends Appliance { turnOn(): void { console.log("[Bài 24] Fan is spinning"); } }
new Fan().turnOn();

// 25. Create a class Shape with a static method describe().
class StaticShape {
    static describe(): void { console.log("[Bài 25] This is a geometric shape."); }
  }
  StaticShape.describe();

// 26. Create a class Order with list of products. Add method to calculate total price.
class Order {
    constructor(public products: Product[]) {}
    calculateTotal(): number {
      return this.products.reduce((total, p) => total + p.price, 0);
    }
  }
  const myOrder = new Order(products);
  console.log(`[Bài 26] Order Total: ${myOrder.calculateTotal()}`);

// 27. Create a class Teacher that extends Person. Add subject attribute and introduce method.
class Teacher extends Person {
    constructor(name: string, age: number, public subject: string) { super(name, age); }
    introduce(): void { console.log(`[Bài 27] Hi, I'm ${this.name}, teaching ${this.subject}`); }
  }
  const teacher = new Teacher("Mr. Hai", 35, "TypeScript & React Native");
  teacher.introduce();

// 28. Create a class Animal with protected method makeSound(). Extend Dog and Cat to override it.
class ProtectedAnimal {
    protected makeSound(): void { console.log("Sound!"); }
  }
  class ProtectedDog extends ProtectedAnimal {
    public bark(): void { 
      process.stdout.write("[Bài 28] Protected method called: ");
      this.makeSound(); 
    }
  }
  new ProtectedDog().bark();

// 29. Create an interface Movable with method move(). Implement it in Car and Robot.
interface Movable { move(): void; }
class Robot implements Movable { move(): void { console.log("[Bài 29] Robot is moving automatically"); } }
new Robot().move();

// 30. Create a class School with list of Students and Teachers. Add method to display info.
class School {
    students: Student[] = [];
    teachers: Teacher[] = [];
    constructor(public name: string) {}
    displayInfo(): void {
      console.log(`[Bài 30] ${this.name} has ${this.students.length} students and ${this.teachers.length} teachers.`);
    }
  }
  const fitIuh = new School("Faculty of Information Technology - IUH");
  fitIuh.students.push(student);
  fitIuh.teachers.push(teacher);
  fitIuh.displayInfo();
