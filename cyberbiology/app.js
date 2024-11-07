const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d", { alpha: false });
const MIND_SIZE = 64;

canvas.width = screen.width/2;
canvas.height = screen.height-200;

const dnaTable = document.getElementById("dna-table");
const flagTable = document.getElementById("flag-table");
const memTable = document.getElementById("mem-table");

/*// if(msg.startsWith("EAT")) el.style.color = "yellow";
                    // if(msg.startsWith("MTE")) el.style.color = "blue";
                    // if(msg.startsWith("PHS")) el.style.color = "green";
                    // if(msg.startsWith("GMN")) el.style.color = "lightblue";
                    // if(msg.startsWith("RTM")) el.style.color = "purple";
 */

const opColors = {
    5: "yellow",
    6: "yellow",
    9: "blue",
    3: "green",
    4: "green",
    17: "lightblue",
    19: "purple"
}

const mod = (a, b) => {
    b += 1;
    return ((a % b) + b) % b;
}

for(let x = 0; x < Math.sqrt(MIND_SIZE); x++) {
    let tr = document.createElement("tr");
    for(let y = 0; y < Math.sqrt(MIND_SIZE); y++) {
        let td = document.createElement("td");
        td.innerText = 0;
        td.onclick = () => {
            if(!customDNA) return;
            let i = (x*Math.sqrt(MIND_SIZE))+y;
            customDNA[i] = +prompt("Enter your DNA value.");
            if(isNaN(customDNA[i])) customDNA[i] = 0;
            td.innerText = customDNA[i];
        }
        tr.appendChild(td);
    }
    dnaTable.appendChild(tr);
}

for(let i = 0; i < 8; i++) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerText = 0;
    tr.appendChild(td);
    flagTable.append(tr);
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.innerText = 0;
    tr.appendChild(td);
    memTable.appendChild(tr);
}

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const getXY = (i, w) => [i % w, (i - (i % w)) / w];

class World {
    constructor() {
        const World = this;
        this.creatures = {};
        this.size = 6;
        this.width = ~~(canvas.width/this.size);
        this.height = ~~(canvas.height/this.size);
        this.pause = false;
        this.speed = 1;
        this.ticks = 0;
        this.cycles = 0;
        this.sunpower = [15, 10, 5]; // summer
        this.mode = "normal"; // normal, energy, age, minerals

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        this.clearWorld();
        
        function tick() {
            if(World.pause) return requestAnimationFrame(tick); 
            document.getElementById("ticks").innerText = (++World.ticks) + " ticks";
            World.cycles = ~~(World.ticks/512);
            document.getElementById("cycles").innerText = World.cycles + " cycles";
            if(World.speed === 2) document.getElementById("ticks").innerText = (++World.ticks) + " ticks";
            if(World.speed === 4) {
                document.getElementById("ticks").innerText = (++World.ticks) + " ticks";
                document.getElementById("ticks").innerText = (++World.ticks) + " ticks";
            }
            if(World.cycles%4 === 0) {
                World.sunpower = [15, 10, 5]; // summer
                document.getElementById("year").textContent = "Summer";
                document.getElementById("year").style.backgroundColor = "yellow";
            }
            if(World.cycles%4 === 1) {
                World.sunpower = [10, 5, 2]; // autumn
                document.getElementById("year").textContent = "Autumn";
                document.getElementById("year").style.backgroundColor = "red";
            }
            if(World.cycles%4 === 2) {
                World.sunpower = [5, 3, 0]; // winter
                document.getElementById("year").textContent = "Winter";
                document.getElementById("year").style.backgroundColor = "blue";
            }
            if(World.cycles%4 === 3) {
                document.getElementById("year").textContent = "Spring";
                document.getElementById("year").style.backgroundColor = "green";
                World.sunpower = [10, 5, 3]; // spring
            }
            for(let i in World.creatures) {
                World.operate(World.creatures[i]);
                if(!World.creatures[i]) continue;
                if(World.speed === 2) {
                    World.operate(World.creatures[i]);
                }
                if(World.speed === 4) {
                    if(!World.creatures[i]) continue;
                    World.operate(World.creatures[i]);
                    if(!World.creatures[i]) continue;
                    World.operate(World.creatures[i]);
                }
            };
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    };
    setPixel(x, y, col) {
        if(x === undefined || y === undefined) return;
        x *= this.size;
        y *= this.size;
        ctx.fillStyle = col;
        ctx.fillRect(x, y, this.size, this.size);
    }
    getPixel(x, y) {
        x *= this.size;
        y *= this.size;
        const d = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const i = (y*this.width+x)*3;
        return [d[i], d[i+1], d[i+2]];
    }
    clearPixel(x, y) {
        if(y >= 0 && y <= 12) this.setPixel(x, y, "#fcff96");
        else if(y > 12 && y <= 26) this.setPixel(x, y, "#fdffb0");
        else if(y > 26 && y <= 39) this.setPixel(x, y, "#feffcf");
        else this.setPixel(x, y, "white");
        if(y >= 40 && x <= 12) this.setPixel(x, y, "#bdbdff");
        if(y >= 40 && x >= (this.width+~~(12/this.size)*this.size)-(~~(12/this.size)*this.size)*2) this.setPixel(x, y, "#bdbdff");
    };
    clearWorld() {
        ctx.fillStyle = "#fcff96";
        ctx.fillRect(0, 0, canvas.width, 80);
        ctx.fillStyle = "#fdffb0";
        ctx.fillRect(0, 80, canvas.width, 80);
        ctx.fillStyle = "#feffcf";
        ctx.fillRect(0, 80*2, canvas.width, 80);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 80*3, canvas.width, canvas.height-120);
        ctx.fillStyle = "#bdbdff"
        ctx.fillRect(0, 80*3, ((this.size*2)*this.size)+this.size, canvas.height);
        ctx.fillRect((((this.width*this.size)-(this.size*this.size)*2)+this.size)-this.size, 80*3, (this.size*2)*this.size*2, canvas.height);
    }
    getFree(x, y) {
        const free = [];
        for(let X = -1; X < 2; X++)
        for(let Y = -1; Y < 2; Y++) if(!this.creatures[`${x+X},${y+Y}`] /* && x+X >= 0 && y+Y >= 0 && x+X < this.width && y+Y < this.height*/) free.push({x:mod(x+X, this.width),y:mod(y+Y, this.height)});
        return free[~~(Math.random()*free.length-1)];
    }
    isRelative(cell, cell2) {
        let ch = 0;
        if(cell.dead || cell2.dead) return false;
        for(let i = 0; i < 256; i++) if(cell.dna.raw[i] !== cell2.dna.raw[i]) ch++;
        return ch < 2;
    }
    findRelative(cell) {
        const relatives = [];
        for(let X = -1; X < 2; X++)
        for(let Y = -1; Y < 2; Y++) if(this.creatures[`${x+X},${y+Y}`] && x+X >= 0 && y+Y >= 0 && x+X < this.width && y+Y < this.height)
            if(this.creatures[`${x+X},${y+Y}`].multi && this.isRelative(cell, this.creatures[`${x+X},${y+Y}`])) relatives.push({x:x+X,y:y+Y});
        return relatives[~~(Math.random()*relatives.length-1)];
    }
    getXY(x, y, i) {
        switch(i) {
            case 0: return {x:x-1,y:y-1}; // ↖
            case 1: return {x:x,y:y-1};   // ↑
            case 2: return {x:x+1,y:y-1}; // ↗
            case 7: return {x:x-1,y:y};   // ←
            case 3: return {x:x+1,y:y};   // →
            case 6: return {x:x-1,y:y+1}; // ↙
            case 5: return {x:x,y:y+1};   // ↓
            case 4: return {x:x+1,y:y+1}; // ↘
        }
    }
    goRed(bot, num) {
        bot.col.r += num;
        if (bot.col.r > 255) bot.col.r = 255;
        let nm = num / 2;
        bot.col.g -= nm;
        if (bot.col.g < 0 ) bot.col.b += bot.col.g;
        bot.col.b -= nm;
        if (bot.col.b < 0) bot.col.g += bot.col.b;
        if (bot.col.b < 0) bot.col.b = 0;
        if (bot.col.g < 0) bot.col.g = 0;
    }
    goGreen(bot, num) {
        bot.col.g += num;
        if (bot.col.g > 255) bot.col.g = 255;
        let nm = num / 2;
        bot.col.r -= nm;
        if (bot.col.r < 0 ) bot.col.b += bot.col.r;
        bot.col.b -= nm;
        if (bot.col.b < 0) bot.col.r += bot.col.b;
        if (bot.col.r < 0) bot.col.r = 0;
        if (bot.col.b < 0) bot.col.b = 0;
    }
    goBlue(bot, num) {
        bot.col.b += num;
        if (bot.col.b > 255) bot.c_blue = 255;
        let nm = num / 2;
        bot.col.g -= nm;
        if (bot.col.g < 0 ) bot.col.r += bot.col.g;
        bot.col.r -= nm;
        if (bot.col.r < 0) bot.c_green += bot.col.r;
        if (bot.col.r < 0) bot.col.r = 0;
        if (bot.col.g < 0) bot.col.g = 0;
    }
    // Instead of adding these methods to every cell I'll just add them once in World class. Probably will make it more optimized.
    share(cell) {
        if(!cell.multi) return;
        if(cell.energy < 60) return
        cell.energy /= 2;
        let cell2 = this.creatures[`${cell.stick[0]},${cell.stick[1]}`];
        if(!cell2) {
            let tryRel = this.findRelative(cell);
            if(!tryRel) return;
            cell.stick[0] = tryRel.x;
            cell.stick[1] = tryRel.y;
            cell2 = this.creatures[`${cell.stick[0]},${cell.stick[1]}`];
        };
        cell2.energy *= 2;
        if(cell2.energy > 100) cell2.energy = 100;
    } 
    move(cell, pos) {
        // if(cell.dontMove) return;
        if(cell.multi && !cell.dead) return;
        let {x, y} = this.getXY(cell.x, cell.y, pos);
        if(x < 0 || y < 0 || x > this.width || y > this.height) {
            x = mod(x, this.width);
            y = mod(y, this.height);
        };
        // if(this.creatures[`${x},${y}`] /*&& cell.dead*/) return cell.dontMove = true;
        if(this.creatures[`${x},${y}`]) return;
        this.clearPixel(cell.x, cell.y);
        this.creatures[`${x},${y}`] = cell;
        delete this.creatures[`${cell.x},${cell.y}`];
        cell.lastX = cell.x;
        cell.lastY = cell.y;
        cell.x = x;
        cell.y = y;
        if(!cell.dead) cell.energy--;
    }
    eat(cell, pos, relative) {
        if(!this.getFree(cell.x, cell.y) && cell.multi) return;
        pos = this.getXY(cell.x, cell.y, pos);
        if(!this.creatures[`${pos.x},${pos.y}`]) return;
        let cell2eat = this.creatures[`${pos.x},${pos.y}`];
        if(relative && this.isRelative(cell, cell2eat)) return;
        if(cell2eat.dead) {
            delete this.creatures[`${pos.x},${pos.y}`];
            this.clearPixel(pos.x, pos.y);
            cell.minerals++;
            cell.energy ++;
            cell.col.r += 6;
            cell.col.g -= 2;
        } else {
            if(cell.energy > cell2eat.energy - 10 && cell.minerals >= cell2eat.minerals) {
                this.die(cell2eat, `Killed by ${cell.x},${cell.y} cell.`);
                cell.energy += cell2eat.energy
                this.share(cell);

                delete this.creatures[`${pos.x},${pos.y}`];
                this.clearPixel(pos.x, pos.y);
                this.goRed(cell, cell2eat.energy);
            } else {
                cell2eat.energy -= cell.energy;
                if(cell2eat.minerals >= 1) {
                    this.goBlue(cell, 40);
                    cell2eat.minerals--;
                    cell2eat.energy += 40;
                    this.share(cell2eat);
                };
                if(cell2eat.energy <= 0) {
                    this.die(cell2eat, "Died while fighting.");
                }
                delete this.creatures[`${pos.x},${pos.y}`];
                this.clearPixel(pos.x, pos.y);
            }
        }
    }
    reproduce(cell) {
        if(cell.energy < 50) return;
        const coords = this.getFree(cell.x, cell.y);
        cell.energy -= 50;
        if(cell.energy <= 0) this.mineral2energy(cell);
        let j = 0;
        for(let i = 0; i < 8; i++) {
            let pos = this.getXY(cell.x, cell.y, i)
            if(this.creatures[`${pos.x},${pos.y}`]) j++;
        }
        if(!coords || cell.energy <= 1 || j >= 8) if(!cell.multi) return this.die(cell, "Tried to reproduce.");
                                        else return;
        let newDNA = cell.dna.raw;
        if(cell.multi && Math.random() >= 0.95) cell.multi = false;
        if(Math.random() >= 0.75)
            newDNA[~~(Math.random()*MIND_SIZE+8)] = ~~(Math.random()*22);
        return new Cell(coords.x, coords.y, newDNA.concat(cell.dna.rawFlags), cell.multi ? [cell.x, cell.y] : undefined);
    }
    mineral2energy(cell) {
        if(cell.minerals < 1) return;
        cell.minerals--;
        cell.energy += 40;
        if(energy > 100) energy = 100;
        this.goBlue(cell, 40);
        this.share(cell);
    }
    die(cell, reason) {
        cell.onMessage(`DIED (${reason})`);
        // if(cell.energy < 10) {
        //     delete this.creatures[`${cell.x}${cell.yy}`];
        //     this.clearPixel(cell.x, cell.y);
        //     return;
        // }
        cell.dead = Date.now();
        cell.col.r = 255-24;
        cell.col.g = 255-24;
        cell.col.b = 255-24;
        cell.dna = {mem: [], rawFlags: [], raw: new Array(64).fill(0), flags: {maxMinerals: 0, hunter: 0, virus: 0}};
        this.setPixel(cell.x, cell.y, `rgb(${cell.col.r},${cell.col.g},${cell.col.b})`);
    }
    operate(cell) {
        if(selectedCell) {
            if(selectedCell.x === cell.x && selectedCell.y === cell.y) {
                document.getElementById("energy").innerText = "Energy: " + ~~cell.energy;
                document.getElementById("x").innerText = "X: " + cell.x;
                document.getElementById("y").innerText = "Y: " + cell.y;
                document.getElementById("pc").innerText = "PC: " + cell.pc;
                document.getElementById("age").innerText = "Age: " + cell.age;
                document.getElementById("minerals").innerText = "Minerals: " + cell.minerals;
                document.getElementById("r").innerText = "R"+Math.round(cell.col.r);
                document.getElementById("g").innerText = "G"+Math.round(cell.col.g);
                document.getElementById("b").innerText = "B"+Math.round(cell.col.b);
                let [x, y] = getXY(cell.pc, Math.sqrt(MIND_SIZE));
                let [x2, y2] = getXY(cell.lastpc-1, Math.sqrt(MIND_SIZE));
                try {
                    // dnaTable.children[y2].children[x2].style.color = "white";
                    let num = parseInt(dnaTable.children[y].children[x].innerText);
                    dnaTable.children[y].children[x].style.color = opColors[num] ? opColors[num] : "white";
                } catch(e) {};
                for(let i = MIND_SIZE; i < MIND_SIZE + 8; i++) flagTable.children[i&7].children[0].innerText = (""+cell.dna.rawFlags[i&7]).replace("undefined", "0");
                for(let i = 0; i < 8; i++) memTable.children[i].children[0].innerText = (""+cell.dna.mem[i]).replace("undefined", "0");
            }
        }
        if(cell.dead) {
            if(Date.now()-cell.dead > 120000*10) {
                this.clearPixel(cell.x, cell.y);
                delete this.creatures[`${cell.x},${cell.y}`];
                return;
            };
            // this.move(cell, 5);
            // if(cell.energy <= 10) cell.energy = 10;
            // this.setPixel(cell.x, cell.y, `rgb(${cell.col.r},${cell.col.g},${cell.col.b})`);
            return;
        }
        if(!cell.dna) return;
        if(this.mode === "normal") this.setPixel(cell.x, cell.y, `rgb(${cell.col.r},${cell.col.g},${cell.col.b})`);
        if(this.mode === "energy") this.setPixel(cell.x, cell.y, `rgb(${cell.energy}, ${cell.energy/3}, ${cell.energy/2})`);
        if(this.mode === "age") this.setPixel(cell.x, cell.y, `rgb(${cell.age}, ${cell.age}, ${cell.age})`);
        if(this.mode === "minerals") this.setPixel(cell.x, cell.y, `rgb(100, 100, ${cell.minerals*50})`);
        const dna = cell.dna.raw;
        if(Math.random() < 0.05) cell.energy -= 1;
        if(cell.energy <= 1) {
            if(cell.dna.flags.hunter && cell.minerals >= 1) {
                cell.minerals--;
                cell.energy += 40;
                this.goBlue(cell, 40);
            } else return this.die(cell, "Died from energy loss.");
        }
        if(Date.now() - cell.now > 5000) {
            cell.now = Date.now();
            cell.age++;
            if(cell.age >= Math.random() * (350 - cell.energy * cell.minerals)*5) return this.die(cell, "Died from age.");
        };
        let addPC = true;
        if(cell.energy >= 99) {
            // let mineral = Math.abs(100-cell.energy);
            // if(mineral > 40 && cell.minerals < cell.maxMinerals) cell.minerals++;
            // cell.energy = 100;
            this.reproduce(cell);
        }; 
        switch(dna[cell.pc]) {
            case 20:
            case 12:
            case 1:
                { // MVR - MoVe Relative to DNA[PC+1]
                    if(cell.multi) break;
                    const pos = cell.direction + dna[cell.pc+1] & 7;
                    cell.onMessage(`MVR ${pos}`);
                    this.move(cell, pos);
                    cell.lastPos = pos;
                    break;
                }
            case 21:
            case 13:
            case 2:
                { // MVA - MoVe Absolute to DNA[PC+1]
                    if(cell.multi) break;
                    const pos = dna[cell.pc+1] & 7;
                    cell.onMessage(`MVA ${pos}`);
                    this.move(cell, pos);
                    cell.lastPos = pos;
                    break;
                }
            case 3:
            case 4:
                { // PHS - PHotoSyntesis
                    if(cell.energy >= 100) break;
                    if(cell.y > 40) break;
                    cell.onMessage(`PHS ${cell.x}, ${cell.y}`);
                    if(cell.y <= 10) {
                        cell.energy += this.sunpower[0];
                        this.goGreen(cell, 5);
                    } else if(cell.y <= 25) {
                        cell.energy += this.sunpower[1];
                        this.goGreen(cell, 3);
                    } else if (cell.y <= 40) {
                        cell.energy += this.sunpower[2];
                        this.goGreen(cell, 1);
                    };
                    if(cell.energy >= 100) cell.energy = 100;
                    break;
                }
            case 5:
            case 6:
                { // EAT - EAT at DNA[PC+1]
                    const pos = dna[cell.pc+1] & 7;
                    cell.onMessage(`EAT ${pos}`);
                    this.eat(cell, pos, true);
                    cell.pc++;
                    cell.lastPos = pos;
                    break;
                }
            case 7:
                { // REP - REProduce
                    // if(cell.energy < 50) break;
                    if(cell.multi) break;
                    // const pos = 8 - (dna[cell.pc+1] & 7);
                    cell.onMessage(`REP`);
                    this.reproduce(cell);
                    break;
                }
            case 8:
                { // ENG - ENerGy
                    let check = dna[cell.pc+1];
                    cell.pc++;
                    if(cell.energy > check) cell.pc++;
                    else cell.pc += 2;
                    addPC = false;
                    cell.onMessage(`ENG ${check}`);
                    break;
                }
            case 9:
                { // MTE - Mineral To Energy
                    this.mineral2energy(cell);
                    cell.onMessage(`MTE`);
                    break;
                }
            case 10:
                { // RTR - Rotate To Right
                    if(cell.multi) break;
                    cell.direction++;
                    cell.direction &= 7;
                    cell.onMessage(`RTR`);
                    break;
                }
            case 11:
                { // RTL - Rotate To Left
                    if(cell.multi) break;
                    cell.direction--;
                    cell.direction &= 7;
                    cell.onMessage(`RTL`);
                    break;
                }
            // case 12:
            //     { // RED - ReAD
            //         const what = cell.dna.raw[cell.pc+1] & 7;
            //         cell.onMessage(`RED ${what} (${cell.dna.mem[what] ? cell.dna.mem[what] : 0})`);
            //         if(cell.dna.mem[what]) cell.pc = cell.dna.mem[what];
            //         break;
            //     }
            // case 13:
            //     {
            //         // WRT - WRiTe
            //         const what = cell.dna.raw[cell.pc+1] & 7;
            //         const to = cell.dna.raw[cell.pc+2] & 63;
            //         cell.onMessage(`WRT ${what}, ${to}`);
            //         cell.dna.mem[what] = to;
            //         cell.pc += 2;
            //         break;
            //     }
            // case 14:
            //     { // LOK - LOoK
            //         const where = cell.dna.raw[cell.pc+1] & 7;
            //         cell.onMessage(`LOK ${where}`);
            //         let {x, y} = this.getXY(cell.x, cell.y, where);
            //         if(x > this.width || y > this.height || x < 0 || y < 0) cell.dna.raw[cell.pc+2];
            //         else if(this.creatures[`${x},${y}`]) {
            //             let cell2 = this.creatures[`${x},${y}`];
            //             if(this.isRelative(cell, cell2)) cell.pc += cell.dna.raw[cell.pc+3];
            //             else cell.pc += cell.dna.raw[cell.pc+4];
            //         } else cell.pc += cell.dna.raw[cell.pc+5];
            //         addPC = false;
            //         break;
            //     }
            case 15:
                { // GIV - GIVe energy
                    const where = cell.dna.raw[cell.pc+1] & 7;
                    cell.onMessage(`GIV ${where}`);
                    if(cell.energy < 20) break;
                    if(!cell.multi) {
                        const {x, y} = this.getXY(cell.x, cell.y, where);
                        const cell2 = this.creatures[`${x},${y}`];
                        if(!cell2) break;
                        if(this.isRelative(cell, cell2) && cell.energy > 15 && cell2.energy < 85) {
                            cell.energy -= 15;
                            cell2.energy += 15;
                        }
                    } else {
                        let cell2 = this.creatures[`${cell.stick[0]},${cell.stick[1]}`];
                        if(!cell2) break;
                        cell.energy -= 15;
                        cell2.energy += 15;
                    }
                    break;
                }
            case 16: 
                { // JMP - JuMP to DNA[PC+1]
                    cell.onMessage(`JMP ${dna[cell.pc+1] & 255}`);
                    cell.pc += dna[cell.pc+1];
                    cell.pc &= 255;
                    break;
                }
            case 17: 
                { // GMN - Get MiNeral
                    cell.onMessage(`GMN`);
                    if(cell.minerals >= cell.dna.flags.maxMinerals) break;
                    if(cell.x <= 12 && cell.y >= 30) cell.minerals += .25;
                    if(cell.x >= this.width-12 && cell.y >= 30) cell.minerals += .75;
                    break;
                }
            // case 18: 
            //     { // IFA - Is Full Around
            //         cell.onMessage(`IFA`);
            //         let j = 0;
            //         for(let i = 0; i < 8; i++) if(this.creatures[this.getXY(cell.x, cell.y, i)]) j++;
            //         if(j >= 8) cell.pc ++;
            //         else cell.pc += 2;
            //         addPC = false;
            //         break;
            //     }
            case 19: 
                { // RTM - Reproduce To Multi
                    const pos = 8 - (dna[cell.pc+1] & 7);
                    cell.onMessage(`RTM ${pos}`);
                    let cell2 = this.reproduce(cell, pos);
                    if(!cell2) break;
                    cell.multi = true;
                    cell.stick = [cell2.x, cell2.y];
                    break;
                }
            // case 19:
            //     { // EER - Eat Even Relative at DNA[PC+1]
            //         const pos = dna[cell.pc+1] & 7;
            //         cell.onMessage(`EER ${pos}`);
            //         this.eat(cell, pos);
            //         cell.pc++;
            //         cell.lastPos = pos;
            //         break;
            //     }
            default:
                { // NOP - No OPcode -> PC + DNA[PC]
                    cell.onMessage(`NOP ${dna[cell.pc]}`);
                    cell.pc += dna[cell.pc];
                    cell.pc &= 255;
                    break;
                }
        }
        cell.lastpc = cell.pc;
        if(addPC) cell.pc++;
        cell.pc &= 255;
        cell.energy -= .1;
        return this;
    }
}

const world = new World();

class Cell { // 
    constructor(x = 0, y = 0, dna = [...Array(MIND_SIZE+8)].map(e=>~~(Math.random()*22)), multi) {
        if(!world.creatures[`${x},${y}`])
        this.x = x;
        this.y = y;
        this.lastX = x;
        this.lastY = y;
        this.pc = 0;
        this.lastpc = 0;
        this.direction = 0;
        this.multi = Boolean(multi);
        this.stick = multi;
        this.col = {
            r: 128,
            g: 128,
            b: 128
        }
        this.dna = {
            raw: dna.slice(0, MIND_SIZE),
            // s1: dna.slice(0, 64),
            // s2: dna.slice(65, 128),
            // s3: dna.slice(128+1, 64*3),
            // s4: dna.slice(64*3+1, MIND_SIZE),
            mem: new Array(8),
            rawFlags: dna.slice(MIND_SIZE, MIND_SIZE+8),
            flags: {
                hunter: dna[MIND_SIZE] <= 8 && this.y >= 90,
                virus: dna[MIND_SIZE+1] === 16,
                maxMinerals: dna[MIND_SIZE+2] & 3
            }
        };
        if(this.dna.flags.hunter) {
            this.col.b += 40;
            this.col.r += 20;
            this.col.g -= 20;
        };
        this.energy = this.dna.flags.hunter ? 50 : 20;
        this.minerals = 0;
        this.maxMinerals = this.dna.flags.hunter ? this.dna.flags.maxMinerals*2 : this.dna.flags.maxMinerals;
        this.age = 0;
        this.birth = Date.now()-2000;
        this.now = Date.now();
        this.dead = false;
        this.lastPos = 0;
        this.dontMove = false;
        world.creatures[`${x},${y}`] = this;
    }
    onMessage(msg) { 
        if(selectedCell) if(selectedCell.x === this.x && selectedCell.y === this.y) {
            const log = document.getElementById("log");
            if(log.childElementCount > 10) {
                log.firstChild.remove();
                log.firstChild.remove();
            };
            let el = document.createElement("span");
            el.innerText = msg;
            if(msg.startsWith("DIED")) el.style.color = "red";
            if(msg.startsWith("EAT")) el.style.color = "yellow";
            if(msg.startsWith("MTE")) el.style.color = "blue";
            if(msg.startsWith("PHS")) el.style.color = "green";
            if(msg.startsWith("GMN")) el.style.color = "lightblue";
            if(msg.startsWith("RTM")) el.style.color = "purple";
            log.appendChild(el);
            log.appendChild(document.createElement("br"));
        }
     }
}

let selectedCell = 0;
canvas.onclick = e => {
    let x = ~~(e.offsetX/world.size);
    let y = ~~(e.offsetY/world.size);
    let cell = world.creatures[`${x},${y}`];
    let sqrt = Math.sqrt(MIND_SIZE);
    if(!cell) {
        const c = useRandom ? new Cell(x, y) : useDefault ? new Cell(x, y, new Array(MIND_SIZE+8).fill(3)) : new Cell(x, y, customDNA);
        selectedCell = c;
        for(let X = 0; X < sqrt; X++) {
            for(let Y = 0; Y < sqrt; Y++) {
                const tr = dnaTable.children[Y];
                tr.children[X].innerText = c.dna.raw[sqrt*Y+X];
                tr.children[X].style.color = "gray";
            }
        }
        return;
    } else {
        if(customDNA) return;
        selectedCell = cell;
        for(let X = 0; X < sqrt; X++) {
            for(let Y = 0; Y < sqrt; Y++) {
                const tr = dnaTable.children[Y];
                tr.children[X].innerText = cell.dna.raw[sqrt*Y+X];
            }
        }
    }
};

canvas.oncontextmenu = e => {
    e.preventDefault();
    let x = ~~(e.offsetX/world.size);
    let y = ~~(e.offsetY/world.size);
    let cell = world.creatures[`${x},${y}`];
    if(cell) {
        if(!cell.dead) world.die(cell, "Killed by God.");
        else {
            delete world.creatures[`${x},${y}`];
            world.clearPixel(x, y);
        }
    }
}

let customDNA = false;
let useRandom = false;
let useDefault = true;
document.getElementById("random").disabled = false;
document.getElementById("custom").disabled = false;
document.getElementById("default").disabled = true;

document.getElementById("custom").onclick = () => {
    selectedCell = false;
    customDNA = new Array(256+8).fill(0);
    useRandom = false;
    useDefault = false;
    document.getElementById("random").disabled = false;
    document.getElementById("custom").disabled = true;
    document.getElementById("default").disabled = false;
    let sqrt = Math.sqrt(MIND_SIZE);
    for(let X = 0; X < sqrt; X++) {
        for(let Y = 0; Y < sqrt; Y++) {
            const tr = dnaTable.children[Y];
            tr.children[X].innerText = 0;
            tr.children[X].style.color = "white";
        }
    }
}
document.getElementById("random").onclick = () => { 
    customDNA = false;
    useRandom = true;
    useDefault = false;
    document.getElementById("custom").disabled = false;
    document.getElementById("random").disabled = true;
    document.getElementById("default").disabled = false;
}
document.getElementById("default").onclick = () => { 
    customDNA = false;
    useRandom = false;
    useDefault = true;
    document.getElementById("custom").disabled = false;
    document.getElementById("random").disabled = false;
    document.getElementById("default").disabled = true;
}

canvas.addEventListener('mousedown', event => {
    if (event.detail > 1) event.preventDefault();
});

document.getElementById("pause").onclick = () => world.pause = true;
document.getElementById("resume").onclick = () => world.pause = false;
document.getElementById("1x").onclick = () => world.speed = 1;
document.getElementById("2x").onclick = () => world.speed = 2;
document.getElementById("4x").onclick = () => world.speed = 4;