document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.querySelector("#bookForm");
  const searchForm = document.querySelector("#searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

function addBook() {
  const title = document.querySelector("#bookFormTitle").value;
  const author = document.querySelector("#bookFormAuthor").value;
  const year = document.querySelector("#bookFormYear").value;
  const checkBox = document.querySelector("#bookFormIsComplete");

  const generateID = generateId();

  if (checkBox.checked) {
    const bookObject = generateBookObject(
      generateID,
      title,
      author,
      Number(year),
      true
    );
    books.push(bookObject);
  } else {
    const bookObject = generateBookObject(
      generateID,
      title,
      author,
      Number(year),
      false
    );
    books.push(bookObject);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  
  const incompleteBookList = document.querySelector("#incompleteBookList");
  incompleteBookList.innerHTML = "";
  const completeBookList = document.querySelector("#completeBookList");
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      incompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const bookItemContainer = document.createElement("div");
  bookItemContainer.classList.add("book-item");
  bookItemContainer.setAttribute("data-bookid", bookObject.id);
  bookItemContainer.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const buttonContainer = document.createElement("div");

  const isCompleteButton = document.createElement("button");
  isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");

  if (bookObject.isCompleted) {
    const iconArrowleft = document.createElement("i");
    iconArrowleft.classList.add("ph-bold");
    iconArrowleft.classList.add("ph-arrow-left");

    const buttonTextIsComplete = document.createTextNode(
      "Belum selesai dibaca "
    );
    isCompleteButton.appendChild(buttonTextIsComplete);
    isCompleteButton.appendChild(iconArrowleft);

    isCompleteButton.addEventListener("click", function () {
      moveToIncomplete(bookObject.id);
    });
  } else {
    const iconArrowright = document.createElement("i");
    iconArrowright.classList.add("ph-bold");
    iconArrowright.classList.add("ph-arrow-right");

    const buttonTextIsComplete = document.createTextNode("Selesai dibaca ");
    isCompleteButton.appendChild(buttonTextIsComplete);
    isCompleteButton.appendChild(iconArrowright);

    isCompleteButton.addEventListener("click", function () {
      moveToComplete(bookObject.id);
    });
  }

  buttonContainer.appendChild(isCompleteButton);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  const iconTrash = document.createElement("i");
  iconTrash.classList.add("ph-bold");
  iconTrash.classList.add("ph-trash");

  deleteButton.addEventListener("click", function () {
    removeBook(bookObject.id);
  });

  const buttonTextDelete = document.createTextNode("Hapus Buku ");
  deleteButton.appendChild(buttonTextDelete);
  deleteButton.appendChild(iconTrash);
  buttonContainer.appendChild(deleteButton);

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  const iconPencil = document.createElement("i");
  iconPencil.classList.add("ph-bold");
  iconPencil.classList.add("ph-note-pencil");

  editButton.addEventListener("click", function () {
    editModal(bookObject.id);
  });

  const buttonTextEdit = document.createTextNode("Edit Buku ");
  editButton.appendChild(buttonTextEdit);
  editButton.appendChild(iconPencil);
  buttonContainer.appendChild(editButton);

  bookItemContainer.appendChild(bookTitle);
  bookItemContainer.appendChild(bookAuthor);
  bookItemContainer.appendChild(bookYear);
  bookItemContainer.appendChild(buttonContainer);

  return bookItemContainer;
}

function moveToIncomplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function moveToComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
  const searchBookTitle = document.querySelector("#searchBookTitle").value;
  const incompleteBookList = document.querySelector("#incompleteBookList");
  incompleteBookList.innerHTML = "";
  const completeBookList = document.querySelector("#completeBookList");
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (
      !bookItem.isCompleted &&
      bookItem.title.toLowerCase().includes(searchBookTitle.toLowerCase())
    ) {
      incompleteBookList.append(bookElement);
    } else if (
      bookItem.isCompleted &&
      bookItem.title.toLowerCase().includes(searchBookTitle.toLowerCase())
    ) {
      completeBookList.append(bookElement);
    }
  }
}

function editModal(bookId) {
  const modalContainer = document.querySelector(".edit-modal");
  const span = document.getElementsByClassName("close")[0];

  modalContainer.style.display = "block";

  span.onclick = function () {
    modalContainer.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modalContainer) {
      modalContainer.style.display = "none";
    }
  };

  const bookTarget = {...findBook(bookId)};
  console.log({booktarget: bookTarget});
  

  const bookTitle = document.querySelector("#editBookFormTitle");
  const bookAuthor = document.querySelector("#editBookFormAuthor");
  const bookYear = document.querySelector("#editBookFormYear");
  const checkBox = document.querySelector("#editBookFormIsComplete");
  const submitEditForm = document.querySelector("#editForm");

  bookTitle.value = bookTarget.title;
  bookAuthor.value = bookTarget.author;
  bookYear.value = bookTarget.year;

  if (bookTarget.isCompleted) {
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }

  submitEditForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updateBook = {
      id: bookTarget.id,
      title: bookTitle.value,
      author: bookAuthor.value,
      year: bookYear.value,
      isCompleted: checkBox.checked,
    };

    const bookIndex = findBookIndex(bookTarget.id);
    books[bookIndex] = updateBook;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    console.log({books: books});
    console.log({bookTarget: bookTarget});
    
    
    modalContainer.style.display = "none";
  })
}




