"use strict";

class Book {
  constructor(title, author, time) {
    this.title = title;
    this.author = author;
    this.time = time;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    //   create tr element
    const row = document.createElement("tr");
    row.insertAdjacentHTML(
      "beforeend",
      `<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.time}</td>
<td><a href="#" class="delete">[X]</a></td>`
    );

    list.append(row);
  }

  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;

    div.append(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector(".book-form");
    container.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector(`.${className}`).remove();
    }, 2000);
  }

  deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("time").value = "";
  }
}

class Storage {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = Storage.getBooks();

    books.forEach((book) => {
      const ui = new UI();

      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Storage.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(time) {
    const books = Storage.getBooks();

    books.forEach((book, index) => {
      if (book.time === time) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOMLoadEvent
document.addEventListener("DOMContentLoaded", Storage.displayBooks);

document
  .getElementById("add-book")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const time = document.getElementById("time").value;

    // instantiate a book
    const userBook = new Book(title, author, time);

    // instantiate a ui
    const ui = new UI();

    // validation
    if (title === "" || author === "" || time === "") {
      //   error alert

      ui.showAlert("Please fill in all fields!", "error");
    } else {
      // add book
      ui.addBookToList(userBook);
      Storage.addBook(userBook);

      // clear fields
      ui.clearFields();

      //   show alert

      ui.showAlert("Book is added!", "success");
    }
  });

//   event listener delete book
document
  .getElementById("book-list")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const ui = new UI();
    ui.deleteBook(event.target);
    Storage.removeBook(
      event.target.parentElement.previousElementSibling.textContent
    );
    ui.showAlert("Book is deleted", "success");
  });
