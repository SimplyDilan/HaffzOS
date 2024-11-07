let canvas = document.getElementById("bg");
let ctx = canvas.getContext("2d");

canvas.style.width = Math.floor(innerWidth/2)*2 + 'px';
window.addEventListener("resize", () => {
    canvas.style.width = Math.floor(innerWidth/2)*2 + 'px';
});

function isMobile() {
    let match = window.matchMedia || window.msMatchMedia;
    if (match) {
        let mq = match("(pointer:coarse)");
        return mq.matches;
    }
    return false;
}
let mobile = isMobile();

if(mobile) {
    let box = document.getElementsByClassName("box")[0];
    canvas.style.width = box.clientWidth + 'px';
}

ctx.imageSmoothingEnabled = false;

let s = document.scrollingElement.scrollTop;
canvas.style.top = 300 + s/3 + 'px';
window.addEventListener("scroll", () => {
    let s = document.scrollingElement.scrollTop;
    canvas.style.top = 300 + s/2 + 'px';
    let rect = canvas.getBoundingClientRect();
    my = rect.y + (canvas.height / 2) - mry + 200;
}, {passive: true});

let my = 0, mry = 0;
document.addEventListener("mousemove", e => {
    let rect = canvas.getBoundingClientRect();
    mry = e.clientY;
    my = rect.y + (canvas.height / 2) - e.clientY + 200;
});

function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject; 
    });
}

let images = {
    farbg: loadImage("/images/undertale/1.png"),
    pillars: loadImage("/images/undertale/2.png"),
    cathedral: loadImage("/images/undertale/3.png"),
    blackbuildings: loadImage("/images/undertale/4.png"),
    blocks: loadImage("/images/undertale/5.png"),
    homes: loadImage("/images/undertale/6.png"),
    closehomes: loadImage("/images/undertale/7.png"),
    star: loadImage("/images/undertale/star.gif"),
};
let starImages = [];
for(let i = 1; i <= 11; i++) {
    starImages.push(loadImage(`/images/undertale/star${i}.png`));
} 

let offsets = {
    farbg: 0,
    pillars: 0,
    cathedral: 0,
    blackbuildings: 0,
    blocks: 0,
    homes: 0,
    closehomes: 0,
    star: 0
}

let closeStars = [];
let veryCloseStars = [];
let farStars = [];
class Star {
    constructor(type = "far") {
        let ix = type === "far" ? 200 : type === "close" ? 30 : 40;
        let stars = type === "far" ? farStars : type === "close" ? closeStars : veryCloseStars;
        let x = Math.floor(Math.random() * canvas.width);
        let y = Math.floor(Math.random() * (type === "veryclose" ? 200 : 50) + ix);
        let df = type === "veryclose" ? 75 : 45;
        if(stars.length > 0) {
            let i = 0;
            let closestStar = stars.reduce((prev, curr) => {
                let prevDist = Math.sqrt(Math.pow(prev.x - x, 2) + Math.pow(prev.y - y, 2));
                let currDist = Math.sqrt(Math.pow(curr.x - x, 2) + Math.pow(curr.y - y, 2));
                return prevDist < currDist ? prev : curr;
            });
            let dist = Math.sqrt(Math.pow(closestStar.x - x, 2) + Math.pow(closestStar.y - y, 2));
            while(dist < df) {
                if(i ++ > 1000) break;
                x = Math.floor(Math.random() * canvas.width);
                y = Math.floor(Math.random() * ix + 70);
                closestStar = stars.reduce((prev, curr) => {
                    let prevDist = Math.sqrt(Math.pow(prev.x - x, 2) + Math.pow(prev.y - y, 2));
                    let currDist = Math.sqrt(Math.pow(curr.x - x, 2) + Math.pow(curr.y - y, 2));
                    return prevDist < currDist ? prev : curr;
                });
                dist = Math.sqrt(Math.pow(closestStar.x - x, 2) + Math.pow(closestStar.y - y, 2));
            }
        }
        this.x = x;
        this.y = y;
        this.speed = 0.2 * (type === "far" ? 1 : type === "close" ? 1.5 : 2.2);
        this.w = type === "veryclose" ? 11*2 : 11;
        this.h = type === "veryclose" ? 13*2 : 13;
        this.type = type;
    }

    draw() {
        let t = +Math.sin(Date.now() / 2000).toFixed(2) / 2 + 0.5;
        if(this.type === "veryclose") {
            ctx.globalAlpha = t;
            let sprite = Math.floor(t * 10);
            ctx.drawImage(starImages[sprite], this.x, this.y + my*0.035, this.w, this.h);
            ctx.globalAlpha = 1;
        } else {
            ctx.drawImage(starImages[4], this.x, this.y + my*0.015, this.w, this.h);
        }
    }

    step() {
        this.x -= this.speed;
        this.x = +this.x.toFixed(1);
        if(this.x < -this.w) {
            this.x = canvas.width;
        }
    }
}
for(let i = 0; i < 25; i++) {
    farStars.push(new Star("far"));
    closeStars.push(new Star("close"));
}
for(let i = 0; i < 10; i++) {
    veryCloseStars.push(new Star("veryclose"));
}

function draw() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let star of farStars) {
        star.draw();
        star.step();
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.drawImage(images.farbg, offsets.farbg, 200 + my*0.01, images.farbg.width*2, images.farbg.height*2);
    ctx.drawImage(images.farbg, offsets.farbg + 1280, 200 + my*0.01, images.farbg.width*2, images.farbg.height*2);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.pillars, offsets.pillars, 255 + my*0.02, images.pillars.width*2, images.pillars.height*2);
    ctx.drawImage(images.pillars, offsets.pillars + 1280, 255 + my*0.02, images.pillars.width*2, images.pillars.height*2);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.cathedral, offsets.cathedral, 225 + my*0.03, images.cathedral.width*2, images.cathedral.height*2);
    ctx.drawImage(images.cathedral, offsets.cathedral + 1280, 225 + my*0.03, images.cathedral.width*2, images.cathedral.height*2);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.blackbuildings, offsets.blackbuildings, 300 + my*0.04, images.blackbuildings.width*2, images.blackbuildings.height*2);
    ctx.drawImage(images.blackbuildings, offsets.blackbuildings + 1280, 300 + my*0.04, images.blackbuildings.width*2, images.blackbuildings.height*2);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.blocks, offsets.blocks, 320 + my*0.05, images.blocks.width*2, images.blocks.height*2);
    ctx.drawImage(images.blocks, offsets.blocks + 1280, 320 + my*0.05, images.blocks.width*2, images.blocks.height*2);
    for(let star of closeStars) {
        star.draw();
        star.step();
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.homes, offsets.homes, 380 + my*0.06, images.homes.width*2, images.homes.height*2);
    ctx.drawImage(images.homes, offsets.homes + 1280, 380 + my*0.06, images.homes.width*2, images.homes.height*2);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.closehomes, offsets.closehomes, 350 + my*0.07, images.closehomes.width*2, images.closehomes.height*2);
    ctx.drawImage(images.closehomes, offsets.closehomes + 1280, 350 + my*0.07, images.closehomes.width*2, images.closehomes.height*2);
    for(let star of veryCloseStars) {
        star.draw();
        star.step();
    }
}

let speed = 0.35;
function step() {
    draw();

    offsets.farbg = (offsets.farbg - speed * 1) % 1280;
    offsets.pillars = (offsets.pillars - speed * 1.3) % 1280;
    offsets.cathedral = (offsets.cathedral - speed * 1.6) % 1280;
    offsets.blackbuildings = (offsets.blackbuildings - speed * 1.9) % 1280;
    offsets.blocks = (offsets.blocks - speed * 2.1) % 1280;
    offsets.homes = (offsets.homes - speed * 2.4) % 1280;
    offsets.closehomes = (offsets.closehomes - speed * 2.7) % 1280;

    requestAnimationFrame(step);
}

(async () => {
    if(mobile) return;
    let vals = await Promise.all(Object.values(images));
    let keys = Object.keys(images);
    for(let i in keys) {
        images[keys[i]] = vals[i];
    }
    vals = await Promise.all(starImages);
    for(let i in vals) {
        starImages[i] = vals[i];
    }
    console.log("Images loaded");

    step();
})()

let bgm = new Audio("/sounds/undertaleps4.mp3");
bgm.loop = true;
document.body.append(bgm);
bgm.play().catch(() => {
    document.addEventListener("click", () => {
        bgm.play();
    }, {once: true});
});
function onVisibilityChange(callback) {
    let visible = true;

    if (!callback) {
        throw new Error('no callback given');
    }

    function focused() {
        if (!visible) {
            callback(visible = true);
        }
    }

    function unfocused() {
        if (visible) {
            callback(visible = false);
        }
    }

    // Standards:
    if ('hidden' in document) {
        visible = !document.hidden;
        document.addEventListener('visibilitychange',
            function () { (document.hidden ? unfocused : focused)() });
    }
    if ('mozHidden' in document) {
        visible = !document.mozHidden;
        document.addEventListener('mozvisibilitychange',
            function () { (document.mozHidden ? unfocused : focused)() });
    }
    if ('webkitHidden' in document) {
        visible = !document.webkitHidden;
        document.addEventListener('webkitvisibilitychange',
            function () { (document.webkitHidden ? unfocused : focused)() });
    }
    if ('msHidden' in document) {
        visible = !document.msHidden;
        document.addEventListener('msvisibilitychange',
            function () { (document.msHidden ? unfocused : focused)() });
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
        document.onfocusin = focused;
        document.onfocusout = unfocused;
    }
    // All others:
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
};

onVisibilityChange(function (visible) {
    if (visible) {
        bgm.muted = false;
    } else {
        bgm.muted = true;
    }
});