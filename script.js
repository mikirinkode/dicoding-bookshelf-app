let bookList = [];
const RENDER_EVENT = "render-book";

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("book-form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  const btnSubmit = document.getElementById("btn-submit");

  btnSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    insertNewBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(bookList);

  const unfinishedBookList = document.getElementById("unfinished-list");
  unfinishedBookList.innerHTML = "";

  const finishedBookList = document.getElementById("finished-list");
  finishedBookList.innerHTML = ""; // agar tidak muncul duplikasi

  for (const book of bookList) {
    const bookCard = createBookCardElement(book);
    if (book.isFinished) {
      finishedBookList.appendChild(bookCard);
    } else {
      unfinishedBookList.appendChild(bookCard);
    }
  }
});

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  console.log(data);

  if (data !== null) {
    for (const book of data) {
      bookList.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isFinished) {
  return {
    id,
    title,
    author,
    year,
    isFinished,
  };
}

function findBook(bookId) {
  for (const book of bookList) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function insertNewBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isFinished = document.getElementById("been-read").checked;

  // create a new book object
  const id = generateId();
  const book = generateBookObject(id, title, author, year, isFinished);

  console.log(book);
  bookList.push(book); // log the book object to the console

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function markBookAsFinished(bookId) {
  const book = findBook(bookId);
  if (book == null) return;
  book.isFinished = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function setBookToUnfinished(bookId) {
  const book = findBook(bookId);
  if (book == null) return;
  book.isFinished = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function removeBookFromList(bookId) {
  const book = findBookIndex(bookId);
  if (book === -1) return;

  bookList.splice(book, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function createBookCardElement(book) {
  //     <div class="book-card border rounded-lg p-2">
  //     <span
  //       class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500 mb-2"
  //       >Selesai</span
  //     >
  //     <p class="font-medium mb-2">
  //       Cara berlatih untuk berpikir kritis
  //     </p>
  //     <div class="flex items-center gap-2">
  //       <i class="fi fi-rr-user"></i>
  //       <p>Muhammad Wafa</p>
  //     </div>
  //     <div class="flex items-center gap-2">
  //       <i class="fi fi-rr-calendar"></i>
  //       <p>2020</p>
  //     </div>
  //     <div class="flex gap-2 items-center mt-4">
  //       <button
  //         id="btn-read-again"
  //         class="flex-1 border hover:border-green-500 hover:text-green-500 text-gray-400 text-sm font-medium py-1 px-2 rounded"
  //       >
  //         Baca Lagi
  //       </button>
  //       <button
  //         id="btn-read-again"
  //         class="flex-1 border hover:border-red-500 hover:text-red-500 text-gray-400 text-sm font-medium py-1 px-2 rounded"
  //       >
  //         Hapus
  //       </button>
  //     </div>
  //   </div>
  const bookCardContainer = document.createElement("div");
  bookCardContainer.setAttribute("id", `book-${book.id}`);
  bookCardContainer.className = "book-card border rounded-lg p-2";

  const label = document.createElement("span");
  if (book.isFinished) {
    label.innerHTML = "Selesai";
    label.className =
      "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500 mb-2";
  } else {
    label.innerHTML = "Belum Selesai";
    label.className =
      "inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400 mb-2";
  }

  const bookTitle = document.createElement("p");
  bookTitle.className = "text-lg font-medium mb-2";
  bookTitle.innerText = book.title;

  const authorContainer = document.createElement("div");
  authorContainer.className = "flex items-center gap-2";
  const authorIcon = document.createElement("i");
  authorIcon.className = "fi fi-rr-user";
  const authorText = document.createElement("p");
  authorText.innerText = book.author;
  authorContainer.appendChild(authorIcon);
  authorContainer.appendChild(authorText);

  const yearContainer = document.createElement("div");
  yearContainer.className = "flex items-center gap-2";
  const yearIcon = document.createElement("i");
  yearIcon.className = "fi fi-rr-calendar";
  const yearText = document.createElement("p");
  yearText.innerText = book.year;
  yearContainer.appendChild(yearIcon);
  yearContainer.appendChild(yearText);

  const actionContainer = document.createElement("div");
  actionContainer.className = "flex gap-2 items-center mt-4";
  const positiveButton = document.createElement("button");
  positiveButton.className =
    "flex-1 border hover:border-green-500 hover:text-green-500 text-gray-400 text-sm font-medium py-1 px-2 rounded";
  if (book.isFinished) {
    positiveButton.innerText = "Baca Lagi";
    positiveButton.addEventListener("click", function () {
      setBookToUnfinished(book.id);
    });
  } else {
    positiveButton.innerText = "Selesai";
    positiveButton.addEventListener("click", function () {
      markBookAsFinished(book.id);
    });
  }
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Hapus";
  deleteButton.className =
    "flex-1 border hover:border-red-500 hover:text-red-500 text-gray-400 text-sm font-medium py-1 px-2 rounded";
  deleteButton.addEventListener("click", function () {
    // removeBookFromList(book.id);
    document
      .getElementById("dialog-delete-confirmation")
      .classList.remove("hidden");
    document
      .getElementById("btn-delete-confirmation")
      .addEventListener("click", function () {
        removeBookFromList(book.id);
        document
          .getElementById("dialog-delete-confirmation")
          .classList.add("hidden");
      });
    document
      .getElementById("btn-cancel-delete")
      .addEventListener("click", function () {
        document
          .getElementById("dialog-delete-confirmation")
          .classList.add("hidden");
      });
  });

  actionContainer.appendChild(positiveButton);
  actionContainer.appendChild(deleteButton);

  bookCardContainer.appendChild(label);
  bookCardContainer.appendChild(bookTitle);
  bookCardContainer.appendChild(authorContainer);
  bookCardContainer.appendChild(yearContainer);
  bookCardContainer.appendChild(actionContainer);

  return bookCardContainer;
}
