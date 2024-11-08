let stopRain;
let rainStopped = localStorage.disablerain == '1';
let rainElements = [...document.getElementsByClassName("rain-hitbox"), document.getElementById("oneko"), "cursor"];
window.isThunder = false;
let rects = new WeakMap();
let rainBgm = new Audio(window.isThunder ? "/sounds/rainHeavy3.mp3" : "/sounds/rainLight1.mp3");
let thunderBgm;
let updateRain;
let isWinter = new Date().getMonth() == 10 || new Date().getMonth() == 11 || new Date().getMonth() == 0 || new Date().getMonth() == 1;
let snowBgm = new Audio("/sounds/snow.ogg");

setTimeout(() => {
    if(isWinter) {
        if(localStorage.disablerain) return;
        let root = document.documentElement;
        root.style.setProperty("--link-color", "#2ba6b2");
        let style = document.createElement("style");
        style.innerHTML = `
            .chat-name {
                color: rgb(41 121 124);
            }
            .status-ok {
                color: #36fdf7;
            }
            #dimdengif, #mood {
                border: 1px solid rgb(41 91 124);
            }
        `;
        document.body.append(style);
        document.getElementById("snow").hidden = false;
        snowBgm.loop = true;
        snowBgm.volume = 0.2;
        document.body.append(snowBgm);
        snowBgm.play().catch(() => {
            document.addEventListener("click", () => {
                snowBgm.play();
            }, { once: true });
        });
        stopRain = () => {
            document.getElementById("snow").hidden = true;
            snowBgm.pause();
        }
        onVisibilityChange(visible => {
            if(visible) {
                snowBgm.play();
            } else {
                snowBgm.pause();
            }
        });
        return;
    };
    if(isSlow) return;

    let forceThunder = false;

    let power = Math.sin(Date.now() / 90000000);
    let thunderPlaying = false;
    window.isThunder = power >= 0.99 || forceThunder;
    rainBgm.loop = true;
    rainBgm.volume = 0.2;
    if(window.isThunder) {
        thunderBgm = new Audio("/sounds/AM_RAIN-QuietThunder.mp3");
        thunderBgm.loop = true;
        document.body.append(thunderBgm);
        if(localStorage.muterain != '1' && !rainStopped) thunderBgm.play().catch(() => {
            document.addEventListener("click", () => {
                thunderBgm.play();
            }, { once: true });
        });
        thunder();
    }

    document.body.append(rainBgm);
    if(localStorage.muterain != '1' && !rainStopped) rainBgm.play().catch(() => {
        document.addEventListener("click", () => {
            rainBgm.play();
        }, { once: true });
    });


    onVisibilityChange(visible => {
        rainBgm.muted = !visible;
        if(thunderBgm) thunderBgm.muted = !visible;
    });

    let chatBox = document.getElementById("chat");
    let chatRect = chatBox.getBoundingClientRect();
    let hmcBox = document.getElementById("hidemycursor-div");
    let hmcRect = hmcBox.getBoundingClientRect();
    let mouseX = 0, mouseY = 0;

    document.addEventListener("mousemove", e => {
        let x = e.pageX; mouseX = e.x;
        let y = e.pageY; mouseY = e.y;

        if(y > chatRect.top && x > chatRect.left && x < hmcRect.right) {
            rainBgm.volume = 0.05;
        } else {
            rainBgm.volume = 0.2;
        }
    });

    stopRain = () => {
        rainBgm.pause();
        if(thunderBgm) thunderBgm.pause();
        clearInterval(spawnInterval);
        clearInterval(slowCheckInterval);
        ctx.clearRect(0, 0, c.width, c.height);
        rainStopped = true;
        window.isThunder = false;
    };
    let slowCheckInterval = setInterval(() => {
        if(isSlow) {
            stopRain();
        }
    }, 100);

    let c = document.getElementById("rain-canvas");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    let ctx = c.getContext("2d");

    let rainDrops = [];
    let defaultLength = 50;
    let defaultSpeed = 27;
    let defaultAngle = 90 * Math.PI / 180;

    let length = defaultLength;
    let speed = defaultSpeed;

    let angle = defaultAngle;
    let angleSin = Math.sin(angle);
    let angleCos = Math.cos(angle);

    setInterval(() => {
        let x = Date.now() / 1000000;
        let power = Math.sin(2*Math.PI*(2*x-Math.cos(x)))/2+0.5;

        angle = (90 + Math.sin(x)*1.25) * Math.PI / 180;
        speed = Math.floor(defaultSpeed + power*10);

        let power2 = Math.sin(Date.now() / 90000000);
        let power3 = Math.sin((Date.now()-1000) / 90000000);
        if(power3 < 0.99 && power2 >= 0.99) {
            clearInterval(spawnInterval);
            spawnInterval = setInterval(newDrop, 1);
            rainBgm.src = "/sounds/rainHeavy3.mp3";
            if(localStorage.muterain != '1' && !rainStopped) rainBgm.play();
            window.isThunder = true;
            if(!thunderBgm) {
                thunderBgm = new Audio("/sounds/AM_RAIN-QuietThunder.mp3");
                thunderBgm.loop = true;
                document.body.append(thunderBgm);
            }
            if(localStorage.muterain != '1' && !rainStopped) thunderBgm.play();
            thunder();
        }
        if(power3 >= 0.99 && power2 < 0.99) {
            clearInterval(spawnInterval);
            spawnInterval = setInterval(newDrop, 100);
            rainBgm.src = "/sounds/rainLight1.mp3";
            if(localStorage.muterain != '1' && !rainStopped) rainBgm.play();
            window.isThunder = false;
            if(thunderBgm) thunderBgm.pause();
        }
        if(power2 >= 0.99 || forceThunder) {
            speed *= 2;
            length = defaultLength * 2;
            angle = (90 + Math.sin(x)*3) * Math.PI / 180;
        } else {
            length = defaultLength;
        }
    }, 1000);
    

    let spawnInterval = setInterval(newDrop, power >= 0.99 || forceThunder ? 1 : 2);

    window.addEventListener("resize", onResize);
    let scrolled = false;
    window.addEventListener("scroll", () => {
        scrolled = Date.now();
    }, { passive: true });

    let paused = false;
    document.addEventListener("visibilitychange", function() {
        if(rainStopped) return;
        if (document.hidden) {
            paused = true;
        } else {
            paused = false;
        }
    });

    function playThunder() {
        if(thunderPlaying || rainStopped) return;
        let audio = new Audio(`/sounds/CThunderA_${Math.floor(Math.random()*5)+1}.mp3`);
        let ctx = new AudioContext();
        let analyser = ctx.createAnalyser();
        let audioSrc = ctx.createMediaElementSource(audio);
        audioSrc.connect(analyser);
        analyser.connect(ctx.destination);
        let dynamicStyle = document.getElementById("dynamic-style");

        function renderFrame() {
            if(rainStopped) return thunderPlaying = false;
            let array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let value = array.reduce((a, b) => a+b, 0);
            if(value > 7000) {
                dynamicStyle.innerHTML = `
                    .box {
                        filter: brightness(${(value/6000).toFixed(3)});
                    }
                `;
            } else {
                dynamicStyle.innerHTML = ``;
            }
            
            if(audio.ended) {
                thunderPlaying = false;
                dynamicStyle.innerHTML = ``;
                return;
            }
            requestAnimationFrame(renderFrame);
        }
        if(localStorage.muterain != '1' && !rainStopped) audio.play().then(() => {
            thunderPlaying = true;
            renderFrame();
        });
    }
    function thunder() {
        if(isTabFocused) playThunder();
        if(window.isThunder) setTimeout(thunder, 10000 + Math.floor(Math.random() * 20000));
    }

    class RainDrop {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.createdAt = Date.now();
            rainDrops.push(this);
        }
    }

    function newDrop() {
        if(scrolled && Date.now() - scrolled > 10) {
            rects = new WeakMap();
            scrolled = false;
        }
        if(rainDrops.length > 100) return;
        new RainDrop(Math.random() * c.width, -40 - 100 * Math.random());
    }
    window.rainDrops = rainDrops;

    updateRain = function() {
        if(rainStopped) return;
        if(paused) return window.requestAnimationFrame(updateRain);

        const now = Date.now();
        const adjustedSpeed = Math.round((speed * 60) / cfps);
        
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.beginPath();

        for (let x = rainDrops.length - 1; x >= 0; x--) {
            const drop = rainDrops[x];
            if(now < drop.wait) continue;

            drop.x += adjustedSpeed * angleCos;
            drop.y += adjustedSpeed * angleSin;

            drop.endX = drop.x + length * angleCos;
            drop.endY = drop.y + length * angleSin;

            ctx.moveTo(Math.floor(drop.x), Math.floor(drop.y));
            ctx.lineTo(Math.floor(drop.endX), Math.floor(drop.endY));

            if (drop.y > c.height) {
                drop.x = Math.random() * c.width;
                drop.endX = drop.x + length * angleCos;
                drop.y = -50;
                drop.endY = -50 + length * angleSin;
                drop.wait = now + Math.random() * 300;
            }
        }

        ctx.stroke();

        clearRegions();
        
        window.requestAnimationFrame(updateRain);
    }
    updateRain();
    let gradient = ctx.createLinearGradient(0, 0, 0, c.height);

    gradient.addColorStop(0, "#55a8ff");
    gradient.addColorStop(1, "white");
    gradient.addColorStop(1, "white");
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0984e3";
    ctx.strokeStyle = gradient;

    function onResize() {
        if(rainStopped) return;
        c.width = innerWidth;
        c.height = innerHeight;

        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#0984e3";
        ctx.strokeStyle = gradient;
    }

    function getRect(el) {
        if(el === "cursor") {
            return {
                x: mouseX,
                y: mouseY + 4,
                left: mouseX,
                top: mouseY + 4,
                width: 14,
                height: 16,
                right: mouseX + 14,
                bottom: mouseY + 16
            };
        }
        if(el.id === "oneko") {
            let rect = el.getBoundingClientRect();
            rect.y += 20;
            rect.top += 20;
            rect.height -= 12;

            return rect;
        }
        let stored = rects.get(el);
        if(stored) return stored;
        let rect = el.getBoundingClientRect();
        let obj = {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
        };
        rects.set(el, obj);
        return obj;
    }
    function clearRegions() {
        if(rainStopped) return;
        ctx.globalCompositeOperation = "destination-out";

        for (let i = 0; i < rainElements.length; i++) {
            let boundingBox = getRect(rainElements[i]);
            let yDistanceBottom = c.height - boundingBox.bottom;
            let yDistanceTop = c.height - boundingBox.top;

            let bottomLeftX =
            boundingBox.left + yDistanceBottom * Math.tan(Math.PI / 2 - angle);
            let bottomRightX =
            boundingBox.right + yDistanceBottom * Math.tan(Math.PI / 2 - angle);

            let bottomLeftX2 =
            boundingBox.left + yDistanceTop * Math.tan(Math.PI / 2 - angle);
            let bottomRightX2 =
            boundingBox.right + yDistanceTop * Math.tan(Math.PI / 2 - angle);

            //From bottom of element to edge of page
            ctx.beginPath();
            ctx.moveTo(boundingBox.left, boundingBox.bottom);
            ctx.lineTo(bottomLeftX, c.height);
            ctx.lineTo(bottomRightX, c.height);
            ctx.lineTo(boundingBox.right, boundingBox.bottom);
            ctx.closePath();
            ctx.fill();

            //From top of element to edge of page
            ctx.beginPath();
            ctx.moveTo(boundingBox.left, boundingBox.top);
            ctx.lineTo(bottomLeftX2, c.height);
            ctx.lineTo(bottomRightX2, c.height);
            ctx.lineTo(boundingBox.right, boundingBox.top);
            ctx.closePath();
            ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
    }
}, 2000);