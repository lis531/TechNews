const date = new Date();

let tweets = [];

const newsNum = document.querySelectorAll('.news');

const rssUrl = 'https://www.wired.com/feed/category/science/latest/rss';

fetch(rssUrl)
  .then(response => response.text())
  .then(str => {
    return new window.DOMParser().parseFromString(str, 'text/xml');
  })
  .then(data => {
    const items = data.querySelectorAll('item');
    items.forEach(item => {
        const title = item.querySelector('title').textContent;
        const link = item.querySelector('link').textContent;
        const pubDate = new Date(item.querySelector('pubDate').textContent);
        const description = item.querySelector('description').textContent;
        const creator = item.querySelector('creator').textContent;
        const publisher = item.querySelector('publisher').textContent;
        const thumbnail = item.querySelector('thumbnail').getAttribute('url');

        tweets.push({
            image: thumbnail,
            header: title,
            author: creator,
            date: pubDate,
            description: description,
            publisher: publisher,
            link: link
            });              
        });
        orderByLatest(tweets);
    });

const defaultOrder = () =>{
    for (let n = 0; n < newsNum.length; n++) {
        const images = newsNum[n].querySelectorAll('img');
        for (let i = 0; i < images.length; i++) {
            images[i].src = tweets[n].image;
        }
        const headings = newsNum[n].querySelectorAll('a');
        for (let h = 0; h < headings.length; h++) {
            headings[h].innerHTML = tweets[n].header;
            headings[h].href = tweets[n].link;
        }
        const author = newsNum[n].querySelector('.newsDesc p:first-of-type');
        author.innerHTML = tweets[n].author;
        const date = newsNum[n].querySelector('.newsDesc p:last-of-type');
        date.innerHTML = tweets[n].date.toLocaleDateString();
    }
}

const orderByLatest = () =>{
    tweets.sort((a, b) => (a.date < b.date) ? 1 : -1);
    defaultOrder();
}
  
const orderByPopular = () =>{
    tweets.sort((a, b) => (a.likes < b.likes) ? 1 : -1);
    defaultOrder();
}
  
const orderByImportant = () =>{
    tweets.sort((a, b) => (a.important < b.important) ? 1 : -1);
    defaultOrder();
}
  
const orderLatest = document.getElementById("latest");
const orderPopular = document.getElementById("popular");
const orderImportant = document.getElementById("lastButton");
orderLatest.addEventListener("click", orderByLatest);
orderPopular.addEventListener("click", orderByPopular);
orderImportant.addEventListener("click", orderByImportant);
  

/* footer */
const footer = document.getElementById("bottom")
footer.innerHTML = `Borys Gajewski © ${date.getFullYear()}`;

/* other */
const home = document.getElementById("home");

const theme = document.getElementById("switch");

const changeTheme = () =>{
    //theme.innerHTML = "toggle_off";
    if (theme.innerHTML == "toggle_off"){
        theme.innerHTML = "toggle_on";
    }else{
        theme.innerHTML = "toggle_off";
    }
}

theme.addEventListener("click", changeTheme);