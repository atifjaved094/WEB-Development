
// Covers DOM, Variables, Fetch API, Event Listener, Map, Set, Classes, Objects
// ================================

// ================================
// 1. Variables
// ================================
let name = "Atif"; // String variable
const age = 22; // Constant variable
var isStudent = true; // Boolean variable

console.log("Name:", name);
console.log("Age:", age);
console.log("Is Student?", isStudent);

// ================================
// 2. DOM Manipulation
// ================================
document.body.innerHTML += `
  <h2 id="greeting">Hello, ${name}!</h2>
  <button id="btnClick">Click Me</button>
  <p id="output"></p>
`;

// Change DOM element after 2 seconds
setTimeout(() => {
  document.getElementById("greeting").innerText = "Welcome to JavaScript!";
}, 2000);

// ================================
// 3. Event Listener
// ================================
document.getElementById("btnClick").addEventListener("click", function () {
  document.getElementById("output").innerText = "Button clicked!";
});

// ================================
// 4. Fetch API Example
// ================================
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => response.json()) // Convert to JSON
  .then(data => {
    console.log("Fetch API Data:", data);
    document.body.innerHTML += `<p>Todo Title: ${data.title}</p>`;
  })
  .catch(error => console.error("Error fetching data:", error));

// ================================
// 5. Map Example
// ================================
let myMap = new Map();
myMap.set("name", "Atif");
myMap.set("age", 22);
myMap.set("isStudent", true);

console.log("Map Example:");
myMap.forEach((value, key) => {
  console.log(key + " => " + value);
});

// ================================
// 6. Set Example
// ================================
let mySet = new Set();
mySet.add(1);
mySet.add(2);
mySet.add(2); // Duplicate values will be ignored
mySet.add(3);

console.log("Set Example:", mySet);

// ================================
// 7. Classes & Objects Example
// ================================
class Student {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  displayInfo() {
    console.log(`Name: ${this.name}, Age: ${this.age}`);
  }
}

// Create object of Student class
let student1 = new Student("Ali", 20);
student1.displayInfo();

let student2 = new Student("Sara", 21);
student2.displayInfo();

// ================================
// End of JavaScript Example
// ================================
