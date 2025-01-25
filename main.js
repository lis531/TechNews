const container = document.querySelector("#newsDiv")

const rssUrls = [
    { url: 'https://www.wired.com/feed/category/science/robots/rss', category: 'Robots' },
    { url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'AI' },
    { url: 'https://www.wired.com/feed/category/science/space/rss', category: 'Space' }
];
let rssResults = [];
let news = [];
let previousNews = "";

(async () => {
    for (let i = 0; i < rssUrls.length; i++) {
        let result = [];
        const response = await fetch(rssUrls[i].url);
        const str = await response.text();
        const data = new window.DOMParser().parseFromString(str, 'text/xml');
        const items = data.querySelectorAll('item');
        items.forEach((item) => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const pubDate = new Date(item.querySelector('pubDate').textContent);
            const description = item.querySelector('description').textContent;
            const creator = item.querySelector('creator')?.textContent || '';
            const thumbnail = item.querySelector('thumbnail')?.getAttribute('url') || '';
            result.push({
                category: rssUrls[i].category,
                image: thumbnail,
                header: title,
                author: creator,
                date: pubDate,
                description: description,
                link: link
            });
        });
        rssResults = [...rssResults, ...result];
    }
    rssResults.sort((a, b) => b.date - a.date);
    news = rssResults;
    defaultOrder();
})();

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(entry.target.classList.contains('description')){
                entry.target.classList.add('text-animation');
            }
            else if(entry.target.classList.contains('content')){
                entry.target.getElementsByClassName('news')[0].classList.add('animate');
                entry.target.getElementsByClassName('newsInfo')[0].classList.add('animate');
            }     
            observer.unobserve(entry.target);
        }
    });
});

const defaultOrder = () => {
    for (let i = 0; i < news.length; i++) {
        if (news[i]) {
            if (previousNews !== news[i].header && !news[i].image.endsWith(".mp4")) {
                container.innerHTML += `
                <div class="content">
                    <div class="news" href="${news[i].link}">
                        <img src="${news[i].image}" alt="">
                        <div class="typewriter">
                            <a href="${news[i].link}">${news[i].header}</a>
                            <p class="description">${news[i].description}</p>
                            <div class="newsInfo">
                                <p>Author <b>${news[i].author}</b></p>
                                <p>Added <b>${news[i].date.toLocaleDateString('pl-PL')}</b></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lineBetween"></div>`;
                previousNews = news[i].header;
                const newsDivs = document.querySelectorAll('.content');
                newsDivs.forEach(div => {
                    observer.observe(div);
                    div.querySelector('.news').addEventListener('click', () => {
                        window.open(news[i].link);
                    });
                });
                const descriptionDivs = document.querySelectorAll('.description');
                descriptionDivs.forEach(description => {
                    observer.observe(description);
                });
            } else {
                previousNews = news[i].header;
            }
        }
    }
    const images = document.querySelectorAll('.news > img');
    images.forEach((img) => {
        img.style.opacity = 0;
        img.addEventListener('load', () => {
            img.animate([
                { opacity: 0, filter: 'blur(10px)' },
                { opacity: 1, filter: 'blur(1px)' }
            ], 500).finished.then(() => {
                img.style.opacity = 1;
            });
        });
    });
    window.scrollTo(0, 0);
};

/* Categories */
const navBarButtons = document.querySelectorAll('.navBarButtons button');
navBarButtons[0].classList.add('active');
for (let i = 0; i < navBarButtons.length; i++) {
    navBarButtons[i].addEventListener('click', () => {
        navBarButtons[i].classList.add('active');
        for (let j = 0; j < navBarButtons.length; j++) {
            if (j !== i) {
                navBarButtons[j].classList.remove('active');
            }
        }
        container.innerHTML = "";
        news = i == 0 ? rssResults : rssResults.filter(item => item.category === navBarButtons[i].textContent);
        defaultOrder();
    });
}

/* Theme */
const toggleNavBar = () => {
    const navBar = document.getElementsByClassName('navBar')[0];
    const isHidden = document.documentElement.style.overflowY === 'hidden';
    navBar.animate([
        { transform: isHidden ? 'translateX(0)' : 'translateX(-100%)' },
        { transform: isHidden ? 'translateX(-100%)' : 'translateX(0)' }
    ], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
    }).finished.then(() => {
        document.documentElement.style.overflowY = isHidden ? 'scroll' : 'hidden';
    });
};

const changeTheme = () => {
    document.documentElement.classList.toggle('light-theme');
    const icon = switchBtn.getElementsByTagName('img')[0];
    icon.src.includes('public/icons/toggle_off.svg') ? icon.src = 'public/icons/toggle_on.svg' : icon.src = 'public/icons/toggle_off.svg';
}

const switchBtn = document.getElementById('switch');
switchBtn.addEventListener('click', () => changeTheme());

/* Footer */
const footer = document.getElementsByTagName('footer')[0];
const date = new Date();
footer.innerHTML = `Borys Gajewski © ${date.getFullYear()}`;

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const threshold = 100;
    if (scrollPosition > threshold) {
        document.getElementsByClassName('top')[0].style.background = 'var(--nav-background)';
    } else {
        document.getElementsByClassName('top')[0].style.background = 'none';
    }
});