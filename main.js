const STORAGE_KEY = "Book_Self";

let books = [];

function storageReady() {
  if (typeof storage === undefined) {
    alert("Browser Anda tidak mendukung penyimpanan");
    return false;
  }
  return true;
}

function saveData() {
  const dataSaved = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, dataSaved);

  console.log("Data buku berhasil disimpan");
}

function loadData() {
  const dataLoaded = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataLoaded);

  if (data !== null) books = data;

  refreshData();
}

function updateData() {
  if (storageReady()) saveData();
}

function convertBookData(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (book of books) {
    if (book.id === bookId) return index;

    index++;
  }
  return -1;
}

const UNCOMPLETED_BOOK_READ = "incompleteBookshelfList";
const COMPLETED_BOOK_READ = "completeBookshelfList";
const BOOK_ID = "bookId";

function bookItem(title, author, year, isComplete) {
  const bookTitle = document.createElement("h2");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("h3");
  bookAuthor.innerText = author;

  const bookYear = document.createElement("p");
  bookYear.innerText = year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  if (isComplete) {
    buttonContainer.append(unreadButton(), clearButton());
  } else {
    buttonContainer.append(readButton(), clearButton());
  }
  return container;
}

function createButton(buttonClass, eventListener, isDone) {
  const button = document.createElement("button");

  if (isDone === "unread") {
    button.innerText = "Belum selesai dibaca";
  } else if (isDone === "read") {
    button.innerText = "Selesai dibaca";
  } else if (isDone === "clear") {
    button.innerText = "Hapus";
  }

  button.classList.add(buttonClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function readButton() {
  return createButton(
    "green",
    function (event) {
      addDoneRead(event.target.parentElement.parentElement);
    },
    (isDone = "read")
  );
}

function unreadButton() {
  return createButton(
    "green",
    function (event) {
      addUnreadBook(event.target.parentElement.parentElement);
    },
    (isDone = "unread")
  );
}

function clearButton() {
  return createButton(
    "red",
    function (event) {
      clearBook(event.target.parentElement.parentElement);
    },
    (isDone = "clear")
  );
}

function addNewBook() {
  const uncompletedReadBook = document.getElementById(UNCOMPLETED_BOOK_READ);

  const newTitle = document.getElementById("inputBookTitle").value;
  const newAuthor = document.getElementById("inputBookAuthor").value;
  const newYear = document.getElementById("inputBookYear").value;

  const newBook = bookItem(newTitle, newAuthor, newYear, false);
  uncompletedReadBook.append(newBook);

  const convertBook = convertBookData(newTitle, newAuthor, newYear, false);

  newBook[BOOK_ID] = convertBook.id;
  books.push(convertBook);

  updateData();
}

function addNewBookComplete() {
  const completedReadBook = document.getElementById(COMPLETED_BOOK_READ);

  const newTitle = document.getElementById("inputBookTitle").value;
  const newAuthor = document.getElementById("inputBookAuthor").value;
  const newYear = document.getElementById("inputBookYear").value;

  const newBook = bookItem(newTitle, newAuthor, newYear, true);
  completedReadBook.append(newBook);

  const convertBook = convertBookData(newTitle, newAuthor, newYear, true);

  newBook[BOOK_ID] = convertBook.id;
  books.push(convertBook);

  updateData();
}

function addDoneRead(bookElement) {
  const bookTitle = bookElement.querySelector(".book_item > h2").innerText;
  const bookAuthor = bookElement.querySelector(".book_item > h3").innerText;
  const bookYear = bookElement.querySelector(".book_item > p").innerText;

  const newBook = bookItem(bookTitle, bookAuthor, bookYear, true);
  const doneRead = document.getElementById(COMPLETED_BOOK_READ);
  doneRead.append(newBook);

  const book = findBook(bookElement[BOOK_ID]);
  book.isComplete = true;
  newBook[BOOK_ID] = book.id;

  bookElement.remove();
  updateData();
}

function addUnreadBook(bookElement) {
  const uncompletedReadBook = document.getElementById(UNCOMPLETED_BOOK_READ);

  const bookTitle = bookElement.querySelector(".book_item > h2").innerText;
  const bookAuthor = bookElement.querySelector(".book_item > h3").innerText;
  const bookYear = bookElement.querySelector(".book_item > p").innerText;

  const newBook = bookItem(bookTitle, bookAuthor, bookYear, false);
  uncompletedReadBook.append(newBook);

  const book = findBook(bookElement[BOOK_ID]);
  book.isComplete = false;
  newBook[BOOK_ID] = book.id;

  bookElement.remove();
  updateData();
}

function clearBook(bookElement) {
  const bookIndex = findBookIndex(bookElement[BOOK_ID]);
  books.splice(bookIndex, 1);

  bookElement.remove();
  updateData();
}

function refreshData() {
  const completedReadBook = document.getElementById(COMPLETED_BOOK_READ);
  const uncompletedReadBook = document.getElementById(UNCOMPLETED_BOOK_READ);

  for (book of books) {
    const newBook = bookItem(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );
    newBook[BOOK_ID] = book.id;

    if (book.isComplete) {
      completedReadBook.append(newBook);
    } else {
      uncompletedReadBook.append(newBook);
    }
  }
}

function searchBook() {
  const inputSearch = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const itemBook = document.querySelectorAll(".book_item");

  for (book of itemBook) {
    const item = book.firstElementChild.textContent.toLowerCase();

    if (item.includes(inputSearch)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("form");
  submit.addEventListener("submit", function (event) {
    event.preventDefault();

    const checkToComplete = document.getElementById("inputBookIsComplete");
    if (checkToComplete.checked) {
      addNewBookComplete();
    } else {
      addNewBook();
    }
  });

  const submitSearch = document.getElementById("searchBook");
  submitSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (storageReady()) {
    loadData();
  }
});
