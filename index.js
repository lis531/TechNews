const date = new Date();

let news = [];
let numberOfNews = 0;

const lineBetween = document.querySelectorAll(".lineBetween");
const container = document.getElementById("container")

let rssUrls = [
    'https://www.wired.com/feed/category/science/robots/rss',
    'https://www.wired.com/feed/tag/ai/latest/rss',
    'https://www.wired.com/feed/category/science/space/rss'
];

const fetchRssData = (rssUrl) => {
    return fetch(rssUrl)
    .then((response) => response.text())
    .then((str) => {
        return new window.DOMParser().parseFromString(str, 'text/xml');
    })
    .then((data) => {
        const items = data.querySelectorAll('item');
        items.forEach((item) => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const pubDate = new Date(item.querySelector('pubDate').textContent);
            const description = item.querySelector('description').textContent;
            const creator = item.querySelector('creator').textContent;
            const publisher = item.querySelector('publisher').textContent;
            const thumbnail = item.querySelector('thumbnail').getAttribute('url');
            numberOfNews += 1;
            news.push({
                image: thumbnail,
                header: title,
                author: creator,
                date: pubDate,
                description: description,
                publisher: publisher,
                link: link,
            });
        });
        orderByLatest(news);
    });
};
  

const defaultOrder = () => {
    for (let n = 0; n < 40; n++) {
        const newsContent = document.createElement("div")
        newsContent.classList.add("content")
        container.append(newsContent)
        if (n < news.length) {

            const image = document.createElement("img");
            image.append(newsContent)
            image.src = news[n].image;

            const header = document.createElement("a");
            header.append(newsContent)
            header.innerHTML = news[n].header;
            header.href = news[n].link;

            const author = document.createElement("p");
            author.append(newsContent)

            author.innerHTML = 'Author ' + news[n].author;
            const date = document.createElement("p");

            date.append(newsContent)
            date.innerHTML = 'Date ' + news[n].date.toLocaleDateString('pl-PL');

            newsContent.style.display = 'flex';
            //lineBetween.style.display = 'flex';
        } else {
            newsContent.style.display = 'none';
            //lineBetween.style.display = 'none';
        }
    }
};

const orderByLatest = () => {
    news.sort((a, b) => (a.date < b.date ? 1 : -1));
    defaultOrder();
};

const orderByOldest = () => {
    news.sort((a, b) => (a.date > b.date ? 1 : -1));
    defaultOrder();
};

const orderByName = () => {
    news.sort((a, b) => (a.header > b.header ? 1 : -1));
    defaultOrder();
};

const orderLatest = document.getElementById('latest');
const orderOldest = document.getElementById('oldest');
const orderName = document.getElementById('lastButton');
orderLatest.addEventListener('click', orderByLatest);
orderOldest.addEventListener('click', orderByOldest);
orderName.addEventListener('click', orderByName);

rssUrls.forEach((rssUrl) => {
    fetchRssData(rssUrl);
});

/* Categories */

const all = document.getElementById('all');
const space = document.getElementById('space');
const ai = document.getElementById('ai');
const robots = document.getElementById('robots');
all.addEventListener('click', () => {
    rssUrls = [
        'https://www.wired.com/feed/category/science/robots/rss',
        'https://www.wired.com/feed/tag/ai/latest/rss',
        'https://www.wired.com/feed/category/science/space/rss'
    ];
    news = [];
    rssUrls.forEach((rssUrl, index) => {
        fetchRssData(rssUrl, index);
    });
});
  
space.addEventListener('click', () => {
    const rssUrl = 'https://www.wired.com/feed/category/science/space/rss';
    news = [];
    fetchRssData(rssUrl);
});
  
ai.addEventListener('click', () => {
    const rssUrl = 'https://www.wired.com/feed/tag/ai/latest/rss';
    news = [];
    fetchRssData(rssUrl);
});
  
robots.addEventListener('click', () => {
    const rssUrl = 'https://www.wired.com/feed/category/science/robots/rss';
    news = [];
    fetchRssData(rssUrl);
});  
  

/* footer */
const footer = document.getElementById('bottom');
footer.innerHTML = `Borys Gajewski © ${date.getFullYear()}`;

/* other */
const theme = document.getElementById('switch');

const changeTheme = () => {
    if (theme.innerHTML == 'toggle_off') {
        theme.innerHTML = 'toggle_on';
        document.documentElement.style.setProperty('--background-color', '#202634')
        document.documentElement.style.setProperty('--button-color', '#283044')
        document.documentElement.style.setProperty('--order-button-color', '#283044')
        document.documentElement.style.setProperty('--button-hover-color', '#414959')
        document.documentElement.style.setProperty('--order-button-hover-color', '#414959')
        document.documentElement.style.setProperty('--darker-button-color', '#232833')
        document.documentElement.style.setProperty('--text-color', '#FFFAFF')
        document.documentElement.style.setProperty('--navBar-color', '#283044')
        document.documentElement.style.setProperty('--box-shadow-color', '#1b1f24')
    } else {
        theme.innerHTML = 'toggle_off';
        document.documentElement.style.setProperty('--background-color', '#FFFFFF')
        document.documentElement.style.setProperty('--button-color', '#F0F0F0')
        document.documentElement.style.setProperty('--order-button-color', '#F0F0F0')
        document.documentElement.style.setProperty('--button-hover-color', '#E5E5E5')
        document.documentElement.style.setProperty('--order-button-hover-color', '#E5E5E5')
        document.documentElement.style.setProperty('--darker-button-color', '#D9D9D9')
        document.documentElement.style.setProperty('--text-color', '#000000')
        document.documentElement.style.setProperty('--navBar-color', '#F0F0F0')
        document.documentElement.style.setProperty('--box-shadow-color', '#C2C2C2')        
    }
};

theme.addEventListener('click', changeTheme);
