const date = new Date();

let news = [];
let numberOfNews = 0;
let previousNews = "";

const lineBetween = document.querySelectorAll(".lineBetween");
const container = document.querySelector("#newsDiv")

let rssUrls = [
    'https://www.wired.com/feed/category/science/robots/rss',
    'https://www.wired.com/feed/tag/ai/latest/rss',
    'https://www.wired.com/feed/category/science/space/rss'
];

const fetchRssData = async (rssUrl) => {
    const response = await fetch(rssUrl);
    const str = await response.text();
    const data = new window.DOMParser().parseFromString(str, 'text/xml');
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
    orderByLatest();

    const newsDivs = document.querySelectorAll('.news');
        newsDivs.forEach(div => {
            observer.observe(div);
    });
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
});

const defaultOrder = () => {
    for (let n = 0; n < numberOfNews; n++) {
        if (previousNews !== news[n].header && !news[n].image.endsWith(".mp4")){
            container.innerHTML += `
            <div class="content">
                <div class="news">
                    <img src="${news[n].image}" alt="">
                    <div class="typewriter">
                        <a href="${news[n].link}">${news[n].header}</a>
                        <p id="text" class="description">${news[n].description}</p>
                        <div class="newsInfo">
                            <p>Author <b>${news[n].author}</b></p>
                            <p>Added <b>${news[n].date.toLocaleDateString('pl-PL')}</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lineBetween"></div>`
            previousNews = news[n].header;
        }
        else{
            previousNews = news[n].header;
        }
    }
};

const orderByLatest = () => {
    container.innerHTML = "";
    news.sort((a, b) => (a.date < b.date ? 1 : -1));
    defaultOrder();
};

const orderByOldest = () => {
    container.innerHTML = "";    
    news.sort((a, b) => (a.date > b.date ? 1 : -1));
    defaultOrder();
};

const orderByName = () => {
    container.innerHTML = "";
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
all.style.setProperty('background-color', 'var(--button-hover-color)');
all.addEventListener('click', () => {
    all.style.setProperty('background-color', 'var(--button-hover-color)');
    ai.style.setProperty('background-color', 'inherit');
    space.style.setProperty('background-color', 'inherit');
    robots.style.setProperty('background-color', 'inherit');
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
    space.style.setProperty('background-color', 'var(--button-hover-color)');
    ai.style.setProperty('background-color', 'inherit');
    all.style.setProperty('background-color', 'inherit');
    robots.style.setProperty('background-color', 'inherit');
    const rssUrl = 'https://www.wired.com/feed/category/science/space/rss';
    news = [];
    fetchRssData(rssUrl);
});
  
ai.addEventListener('click', () => {
    ai.style.setProperty('background-color', 'var(--button-hover-color)');
    robots.style.setProperty('background-color', 'inherit');
    space.style.setProperty('background-color', 'inherit');
    all.style.setProperty('background-color', 'inherit');
    const rssUrl = 'https://www.wired.com/feed/tag/ai/latest/rss';
    news = [];
    fetchRssData(rssUrl);
});
  
robots.addEventListener('click', () => {
    robots.style.setProperty('background-color', 'var(--button-hover-color)');
    ai.style.setProperty('background-color', 'inherit');
    space.style.setProperty('background-color', 'inherit');
    all.style.setProperty('background-color', 'inherit');

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
        document.documentElement.style.setProperty('--darker-button-color', '#131925')
        document.documentElement.style.setProperty('--text-color', '#FFFAFF')
        document.documentElement.style.setProperty('--navBar-color', '#283044')
        document.documentElement.style.setProperty('--box-shadow-color', '#1b1f24')
        document.documentElement.style.setProperty('--filter-val', '100%')
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
        document.documentElement.style.setProperty('--filter-val', '0%')
    }
};

theme.addEventListener('click', changeTheme);

/*const input = document.getElementById('newsInput');
const submit = document.getElementById('submit');
const remove = document.getElementById('remove');

const addNews = () => {
    if (input.value !== '') {
        localStorage.setItem('rssUrls', JSON.stringify(rssUrls));
        rssUrls.push(localStorage.getItem('rssUrls'));
        fetchRssData(input.value);
        input.value = '';
    }
};

const removeNews = () => {
    rssUrls = [];
    localStorage.setItem('rssUrls', JSON.stringify(rssUrls));
    news = [];
    container.innerHTML = '';
}

submit.addEventListener('click', addNews);
remove.addEventListener('click', removeNews);*/
