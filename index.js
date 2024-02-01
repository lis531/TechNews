let news = [];
let numberOfNews = 0;
let previousNews = "";

const lineBetween = document.querySelectorAll(".lineBetween");
const container = document.querySelector("#newsDiv")

let rssUrls = [];

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
        const thumbnail = item.querySelector('thumbnail').getAttribute('url');
        numberOfNews += 1;
        news.push({
            image: thumbnail,
            header: title,
            author: creator,
            date: pubDate,
            description: description,
            link: link
        });
    });
    orderByLatest();
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(entry.target.classList.contains('description')){
                entry.target.classList.add('text-animation');
            }else{
                entry.target.classList.add('animate');
            }            
            observer.unobserve(entry.target);
        }
    });
});

const defaultOrder = () => {
    for (let n = 0; n < numberOfNews; n++) {
        if(news[n]){
            if (previousNews !== news[n].header && !news[n].image.endsWith(".mp4")){
                container.innerHTML += `
                <div class="content">
                    <div class="news" href="${news[n].link}">
                        <img src="${news[n].image}" alt="">
                        <div class="typewriter">
                            <a href="${news[n].link}">${news[n].header}</a>
                            <p id="text" class="description">${news[n].description}</p>
                            <div class="newsInfo" id="newsInfoDesktop">
                                <p>Author <b>${news[n].author}</b></p>
                                <p>Added <b>${news[n].date.toLocaleDateString('pl-PL')}</b></p>
                            </div>
                        </div>
                    </div>
                    <div class="newsInfo" id="newsInfoMobile">
                        <p>Author <b>${news[n].author}</b></p>
                        <p>Added <b>${news[n].date.toLocaleDateString('pl-PL')}</b></p>
                    </div>
                </div>
                <div class="lineBetween"></div>`
                previousNews = news[n].header;
                const newsDivs = document.querySelectorAll('.news');
                newsDivs.forEach(div => {
                    observer.observe(div);
                });
                const descriptionDivs = document.querySelectorAll('.description')
                descriptionDivs.forEach(description => {
                    observer.observe(description);
                });
            }
            else{
                previousNews = news[n].header;
            }
        }
    }
};
news.forEach((n) => {
    n.addEventListener('click', () => {
        window.open(n.link);
        console.log(n.link);
    });
});
const orderByLatest = () => {
    if(orderLatest.classList.contains('active')){
        return;
    }
    container.innerHTML = "";
    news.sort((a, b) => (a.date < b.date ? 1 : -1));
    defaultOrder();
    orderOldest.classList.remove('active');
    orderName.classList.remove('active');
    orderLatest.classList.add('active');
};

const orderByOldest = () => {
    if(orderOldest.classList.contains('active')){
        return;
    }
    container.innerHTML = "";    
    news.sort((a, b) => (a.date > b.date ? 1 : -1));
    defaultOrder();
    orderLatest.classList.remove('active');
    orderName.classList.remove('active');
    orderOldest.classList.add('active');
};

const orderByName = () => {
    if(orderName.classList.contains('active')){
        return;
    }
    container.innerHTML = "";
    news.sort((a, b) => (a.header > b.header ? 1 : -1));
    defaultOrder();
    orderOldest.classList.remove('active');
    orderLatest.classList.remove('active');
    orderName.classList.add('active');
};

const orderLatest = document.getElementById('latest');
const orderOldest = document.getElementById('oldest');
const orderName = document.getElementById('lastButton');
orderLatest.addEventListener('click', orderByLatest);
orderOldest.addEventListener('click', orderByOldest);
orderName.addEventListener('click', orderByName);

/* Categories */

const all = document.getElementById('all');
const space = document.getElementById('space');
const ai = document.getElementById('ai');
const robots = document.getElementById('robots');

const backToDefault = () =>{
    all.classList.remove('active');
    space.classList.remove('active');
    ai.classList.remove('active');
    robots.classList.remove('active');
}

const setToAll = () =>{
    all.classList.add('active');
    rssUrls = [
        'https://www.wired.com/feed/category/science/robots/rss',
        'https://www.wired.com/feed/tag/ai/latest/rss',
        'https://www.wired.com/feed/category/science/space/rss'
    ];
    rssUrls.forEach((rssUrl, index) => {
        fetchRssData(rssUrl, index);
    });
};
setToAll();

all.addEventListener('click', () => {
    if(rssUrls.length == 3){
        return;
    }
    news = [];
    backToDefault()
    setToAll();
});
  
space.addEventListener('click', () => {
    if(rssUrls[0] == 'https://www.wired.com/feed/category/science/space/rss'){
        return;
    }
    backToDefault()
    space.classList.add('active');
    rssUrls = ['https://www.wired.com/feed/category/science/space/rss'];
    news = [];
    fetchRssData(rssUrls[0]);
});
  
ai.addEventListener('click', () => {
    if(rssUrls[0] == 'https://www.wired.com/feed/tag/ai/latest/rss'){
        return;
    }
    backToDefault()
    ai.classList.add('active');
    rssUrls = ['https://www.wired.com/feed/tag/ai/latest/rss'];
    news = [];
    fetchRssData(rssUrls[0]);
});
  
robots.addEventListener('click', () => {
    if(rssUrls[0] == 'https://www.wired.com/feed/category/science/robots/rss'){
        return;
    }
    backToDefault()
    robots.classList.add('active');
    rssUrls = ['https://www.wired.com/feed/category/science/robots/rss'];
    news = [];
    fetchRssData(rssUrls[0]);
});

/* footer */
const footer = document.getElementsByTagName('footer')[0];
const date = new Date();
footer.innerHTML = `Borys Gajewski © ${date.getFullYear()}`;

/* other */
const theme = document.getElementById('switch');
const changeTheme = () => {
    const img = theme.getElementsByTagName('img')[0];
    if (img.src.includes('public/toggle_off.svg')) {
        img.src = 'public/toggle_on.svg';
        document.documentElement.style.setProperty('--background-color', '#202634')
        document.documentElement.style.setProperty('--button-color', '#283044')
        document.documentElement.style.setProperty('--button-hover-color', '#41495977')
        document.documentElement.style.setProperty('--button-pressed-color', '#414959')
        document.documentElement.style.setProperty('--darker-button-color', '#131925')
        document.documentElement.style.setProperty('--text-color', '#FFFAFF')
        document.documentElement.style.setProperty('--navBar-color', '#283044')
        document.documentElement.style.setProperty('--box-shadow-color', '#1b1f24')
        document.documentElement.style.setProperty('--filter-val', '100%')
    } else {
        img.src = 'public/toggle_off.svg';
        document.documentElement.style.setProperty('--background-color', '#FFFFFF')
        document.documentElement.style.setProperty('--button-color', '#F0F0F0')
        document.documentElement.style.setProperty('--order-button-color', '#F0F0F0')
        document.documentElement.style.setProperty('--button-hover-color', '#E5E5E577')
        document.documentElement.style.setProperty('--button-pressed-color', '#E5E5E5')
        document.documentElement.style.setProperty('--darker-button-color', '#D9D9D9')
        document.documentElement.style.setProperty('--text-color', '#000000')
        document.documentElement.style.setProperty('--navBar-color', '#F0F0F0')
        document.documentElement.style.setProperty('--box-shadow-color', '#C2C2C2')
        document.documentElement.style.setProperty('--filter-val', '0%')
    }
};

const changeBarStatus = () => {
    if(document.getElementsByClassName('navBar')[0].classList.contains('appear')){
        document.getElementsByClassName('navBar')[0].classList.remove('appear');
        document.getElementsByClassName('navBar')[0].classList.add('disappear');
        if(theme.getElementsByTagName('img')[0].src.includes('public/toggle_off.svg'))
            document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        else
            document.documentElement.style.setProperty('--background-color', '#202634');
        document.getElementById('navigation').style.bgColor = 'flex';
        document.documentElement.style.overflowY = 'scroll';
    }
    else{
        document.getElementsByClassName('navBar')[0].classList.add('appear');
        document.getElementsByClassName('navBar')[0].classList.remove('disappear');
        if(theme.getElementsByTagName('img')[0].src.includes('public/toggle_off.svg'))
            document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        else
            document.documentElement.style.setProperty('--background-color', '#283044');
        document.getElementById('navigation').style.display = 'none';
        document.documentElement.style.overflowY = 'hidden';
    }
}

theme.addEventListener('click', changeTheme);