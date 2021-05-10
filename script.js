const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container');

let bookmarks = [];
//Show Modal
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


//Validate form
function validate(nameValue , urlValue) {
    const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(exp);

    if (!nameValue || !urlValue){
        alert('Please enter both the fields');
    }
    
    if (!urlValue.match(regex)){
        alert('Please enter a valid url');
    }
    return true;
}

//Build bookmarks
function buildBookmarks() {
    //Remove all bookmarks
    bookmarkContainer.textContent = '';
    //Build Items
    bookmarks.forEach((b) => {
        const { name, url} = b;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        //Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Favicon/LinkContainer
        const LinkInfo = document.createElement('div');
        LinkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.textContent = name;
        //Append to bookmarks container
        LinkInfo.append(favicon, link);
        item.append(closeIcon, LinkInfo);
        bookmarkContainer.appendChild(item);

    })
}

//Fetch Bookmarks
function fetchBookmarks() {
    //Get bookmarks from localstorage if available
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } 
    buildBookmarks();
}

//Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    }); 
    //Update bookmarks array in localStorage and repopulate the DOM
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Submit form 
function storeBookmark(e) { 
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://','https://')){
        urlValue = `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
}

bookmarkForm.addEventListener('submit', storeBookmark);

//On load fetch bookmarks
fetchBookmarks();