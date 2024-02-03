let rak = [];

function ambilData(ambilData) {
  ambilData.preventDefault();
  const title = document.querySelector("#inputBookTitle"),
    author = document.querySelector("#inputBookAuthor"),
    year = document.querySelector("#inputBookYear"),
    isComplete = document.querySelector("#inputBookIsComplete"),
    book = {
      id: +new Date(),
      title: title.value,
      author: author.value,
      year: year.value,
      isComplete: isComplete.checked,
    };
  console.log(book), rak.push(book), document.dispatchEvent(new Event("rubahBuku"));
}

function e(rak) {
  const belumSelesai = document.querySelector("#incompleteBookshelfList"),
    sudahSelesai = document.querySelector("#completeBookshelfList");
  (belumSelesai.innerHTML = ""), (sudahSelesai.innerHTML = "");
  for (const data of rak) {
    const rak = document.createElement("article");
    rak.classList.add("book_item");
    const jud = document.createElement("h2");
    jud.innerText = data.title;
    const pen = document.createElement("p");
    pen.innerText = "Penulis: " + data.author;
    const tah = document.createElement("p");
    if (
      ((tah.innerText = "Tahun: " + data.year),
      rak.appendChild(jud),
      rak.appendChild(pen),
      rak.appendChild(tah),
      data.isComplete)
    ) {
      const div = document.createElement("div");
      div.classList.add("action");
      const but = document.createElement("button");
      (but.id = data.id),
        (but.innerText = "Belum Selesai dibaca"),
        but.classList.add("green"),
        but.addEventListener("click", c);
      const butt = document.createElement("button");
      (butt.id = data.id),
        (butt.innerText = "Hapus buku"),
        butt.classList.add("red"),
        butt.addEventListener("click", d),
        div.appendChild(but),
        div.appendChild(butt),
        rak.appendChild(div),
        sudahSelesai.appendChild(rak);
    } else {
      const div = document.createElement("div");
      div.classList.add("action");
      const but = document.createElement("button");
      (but.id = data.id),
        (but.innerText = "Selesai dibaca"),
        but.classList.add("green"),
        but.addEventListener("click", b);
      const butt = document.createElement("button");
      (butt.id = data.id),
        (butt.innerText = "Hapus buku"),
        butt.classList.add("red"),
        butt.addEventListener("click", d),
        div.appendChild(but),
        div.appendChild(butt),
        rak.appendChild(div),
        belumSelesai.appendChild(rak);
    }
  }
}

function b(ambilData) {
  const a = Number(ambilData.target.id),
    b = rak.findIndex(function (rak) {
      return rak.id === a;
    });
  -1 !== b &&
    ((rak[b] = {
      ...rak[b],
      isComplete: !0,
    }),
    document.dispatchEvent(new Event("rubahBuku")));
}

function c(ambilData) {
  const a = Number(ambilData.target.id),
    c = rak.findIndex(function (rak) {
      return rak.id === a;
    });
  -1 !== c &&
    ((rak[c] = {
      ...rak[c],
      isComplete: !1,
    }),
    document.dispatchEvent(new Event("rubahBuku")));
}

function d(ambilData) {
  const a = Number(ambilData.target.id),
    d = rak.findIndex(function (rak) {
      return rak.id === a;
    });
  -1 !== d &&
    (rak.splice(d, 1), document.dispatchEvent(new Event("rubahBuku")));
}

function a(ambilData) {
  ambilData.preventDefault();
  const n = document.querySelector("#searchBookTitle");
  (query = n.value),
    query
      ? e(
          rak.filter(function (rak) {
            return rak.title.toLowerCase().includes(query.toLowerCase());
          })
        )
      : e(rak);
}

function sett() {
  !(function (rak) {
    localStorage.setItem("books", JSON.stringify(rak));
  })(rak),
    e(rak);
}

window.addEventListener("load", function () {
  (rak = JSON.parse(localStorage.getItem("books")) || []), e(rak);
  const o = document.querySelector("#inputBook"),
    d = document.querySelector("#searchBook");
  o.addEventListener("submit", ambilData),
    d.addEventListener("submit", a),
    document.addEventListener("rubahBuku", sett);
});
