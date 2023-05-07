const date = new Date();

let news = [];

const newsNum = document.querySelectorAll('.news');
const newsContainer = document.querySelectorAll('.content');
const lineBetween = document.querySelectorAll('.lineBetween');

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
    for (let n = 0; n < newsNum.length; n++) {
        if (n < news.length) {
            const images = newsNum[n].querySelectorAll('img');
            for (let i = 0; i < images.length; i++) {
                images[i].src = news[n].image;
            }
            const headings = newsNum[n].querySelectorAll('a');
            for (let h = 0; h < headings.length; h++) {
                headings[h].innerHTML = news[n].header;
                headings[h].href = news[n].link;
            }
            const author = newsNum[n].querySelector('.newsInfo p:first-of-type');
            author.innerHTML = 'Author ' + news[n].author;
            const date = newsNum[n].querySelector('.newsInfo p:last-of-type');
            date.innerHTML = 'Date ' + news[n].date.toLocaleDateString('pl-PL');
            newsContainer[n].style.display = 'flex';
            lineBetween[n].style.display = 'flex';
        } else {
            newsContainer[n].style.display = 'none';
            lineBetween[n].style.display = 'none';
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
    } else {
        theme.innerHTML = 'toggle_off';
    }
};

theme.addEventListener('click', changeTheme);