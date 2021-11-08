let userBooks = []
let resCountIndex = 0

const searchFunc = document.querySelector('#in2')
// const outputSelect = document.querySelector('#outDest')

searchFunc.addEventListener('click', searchClickHandler)

async function searchClickHandler(event){
    resCountIndex = 0

    let apiSearchBase = 'http://openlibrary.org/search.json?q='

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

    res.docs.forEach(element => {
        let apiImageRes = `https://covers.openlibrary.org/b/id/${element.cover_i}-M.jpg`
        // let imageAdd = await fetch(apiImageSearch)

        outputSelect.innerHTML +=
            `<div class="card sticky-action" value=${element.key}>
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src=${apiImageRes}>
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${element.title}<i class="material-icons right">more_vert</i></span>
                    <a class="waves-effect waves-light btn-small">To Read</a>
                    <a class="waves-effect waves-light btn-small">Have Read</a>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                </div>
            </div>`

    });

}