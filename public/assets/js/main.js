let userBooks = []
let resCountIndex = 0

let initDbValues = async () =>{
    let dbBooks = await fetch('books')
    let bookDBres = await dbBooks.json()
    userBooks = bookDBres
    console.log(`This is User Books ${userBooks}`)
    console.log(userBooks)
    let localStoreDB = {books: userBooks}
    localStorage.setItem('userBooks', JSON.stringify(localStoreDB))
}

initDbValues()

if( localStorage.getItem('userBooks') != null){
    let localGrab = localStorage.getItem('userBooks')
    console.log(localGrab)
    let tempLocal = JSON.parse(localGrab)
    console.log(tempLocal)
    console.log(tempLocal.books)
    userBooks = tempLocal.books
}

const searchFunc = document.querySelector('#in2')
// const outputSelect = document.querySelector('#outDest')

async function searchClickHandler(event){
    resCountIndex = 0

    let apiSearchBase = 'https://openlibrary.org/search.json?q='

    let userSearchQ = document.querySelector('#in1')

    let apiString = apiSearchBase + userSearchQ.value
    userSearchQ.value = ''

    console.log(apiString)

    let searchRes = await fetch(apiString)
    
    let test = await searchRes.json()
    console.log(test)
    console.log('This is a log of .docs')
    console.log(test.docs)
    updateSearchResDis(test)
}

const updateSearchResDis = async (res) =>{
    const outputSelect = document.querySelector('#outDest')

    if(resCountIndex == 0){
        outputSelect.innerHTML = ``
    }

    let partialRes = await res.docs.slice(resCountIndex, resCountIndex+10)
    resCountIndex = +10


    partialRes.forEach(element => {
        let apiImageRes = `https://covers.openlibrary.org/b/id/${element.cover_i}-M.jpg`
        let inCollection = userBooks.includes(element.key)

        outputSelect.innerHTML +=
            `<div class="card sticky-action" value=${element.key}>
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src=${apiImageRes}>
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${element.title}<i class="material-icons right">more_vert</i></span>
                    <a id="toReadSelect${element.key}" class="waves-effect waves-light btn-small" value="${element.key}" buttonFunction="toRead">To Read</a>
                    <a id="readSelect${element.key}" class="waves-effect waves-light btn-small" value="${element.key}" buttonFunction="haveRead">Have Read</a>
                    ${inCollection ? '<i class="small favorite"></i>' : '<i class="small favorite_border"></i>' }
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${element.title}<i class="material-icons right">close</i></span>
                </div>
            </div>`

    });

    outputSelect.addEventListener('click', userInputHandler)
    
}

const userInputHandler = (event) =>{
    // console.log(event.target.nextElementSibling.value)
    if(event.target.attributes.buttonFunction.value == "toRead"){addToRead(event.target.attributes.value.value)}
    if(event.target.attributes.buttonFunction.value == "haveRead"){addHaveRead(event.target.attributes.value.value)}
    if(event.target.attributes.buttonFunction.value == "remove"){removeBook(event.target.attributes.value.value)}
    if(event.target.attributes.type.value == "range"){updateRating(event)}
}

const addToRead = async (bookID) =>{
    let apiSearch = `http://openlibrary.org${bookID}.json`

    let searchRes = await fetch(apiSearch)
    
    let test = await searchRes.json()

    let toAdd = await{
        key: bookID,
        image: `https://covers.openlibrary.org/b/id/${test.covers[0]}-M.jpg`,
        title:  test.title,
        read:   false,
        ratting:    0,
    }
    console.log(toAdd)
    userBooks.push(toAdd)
    console.log(userBooks)

    fetch('/books',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(toAdd)
    }).then(res => res.json()).then(data => console.log(data)).then(initDbValues())

    // let storeBooks = {books: userBooks}
    // localStorage.setItem('userBooks', JSON.stringify(storeBooks))
}

const addHaveRead = async (bookID) =>{
    let apiSearch = `http://openlibrary.org${bookID}.json`

    let searchRes = await fetch(apiSearch)
    
    let test = await searchRes.json()

    let toAdd = await {
        key: bookID,
        image: `https://covers.openlibrary.org/b/id/${test.covers[0]}-M.jpg`,
        title:  test.title,
        read:   true,
        ratting:    0,
    }
    console.log(toAdd)
    userBooks.push(toAdd)
    console.log(userBooks)

    fetch('/books',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(toAdd)
    }).then(res => res.json()).then(data => console.log(data)).then(initDbValues())

    // let storeBooks = {books: userBooks}
    // localStorage.setItem('userBooks', JSON.stringify(storeBooks))
}

const removeBook = async (bookID) =>{

    await fetch(`/books/${bookID}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bookID)
      }).then(res => res.json()).then(data => console.log(data)).then(initDbValues())
    
    // const removeIndex = userBooks.findIndex(element =>{element.key == bookID})
    // userBooks.splice(removeIndex, 1)
    // let storeBooks = {books: userBooks}
    // localStorage.setItem('userBooks', JSON.stringify(storeBooks))
    updateUserInfo(true)
    updateUserInfo(false)
}

const updateRating = (event) => {
    console.log(event.target.nextElementSibling.value)
    console.log(event.target.attributes.elementid.value)
    let querry1 = (element) => element.key == event.target.attributes.elementid.value
    let updateIndex = userBooks.findIndex(querry1)
    console.log(updateIndex)
    userBooks[updateIndex].ratting = event.target.nextElementSibling.value
    let storeBooks = {books: userBooks}
    localStorage.setItem('userBooks', JSON.stringify(storeBooks))
    event.target.attributes.value.value = event.target.nextElementSibling.value
}

const updateUserInfo = (haveReadCheck) =>{
    let readOrRead = haveReadCheck ? '#userOutDest1' : '#userOutDest2'
    let userOutputSection = document.querySelector(readOrRead)

    let someUserBooks = userBooks.filter(element =>element.read === haveReadCheck)
    console.log(someUserBooks)

    someUserBooks.forEach(element => {
        let apiImageRes = element.image

        userOutputSection.innerHTML +=
            `<div class="card sticky-action" value=${element.key}>
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src=${apiImageRes}>
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${element.title}<i class="material-icons right">more_vert</i></span>
                    <a id="toReadSelect${element.key}" class="waves-effect waves-light btn-small" value="${element.key}" buttonFunction="toRead">To Read</a>
                    <a id="readSelect${element.key}" class="waves-effect waves-light btn-small" value="${element.key}" buttonFunction="haveRead">Have Read</a>
                    <i id="remove${element.key}" class="small material-icons favorite" buttonFunction="remove" value="${element.key}">favorite</i>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${element.title}<i class="material-icons right">close</i></span>
                    <input id="range${element.key}" elementid="${element.key}" buttonFunction="range" type="range" value="${element.ratting}" min="1" max="100" oninput="this.nextElementSibling.value = this.value">
                    <output>${element.ratting}</output>
                </div>
            </div>`

    });
    userOutputSection.addEventListener('click', userInputHandler)
}

window.addEventListener('load', (event) =>{
    if(document.querySelector('#userOutDest1') != null){
        updateUserInfo(true)
        updateUserInfo(false)
    }
    if(document.querySelector('#userOutDest1') == null){
        searchFunc.addEventListener('click', searchClickHandler)
    }
    console.log(userBooks)
})