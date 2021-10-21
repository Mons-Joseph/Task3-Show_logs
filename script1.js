// http://localhost/C:/Users/monse/AppData/Local/anywhere.app-logs/17-Oct-2021/13-00/AnySnap.html-renderer
const http = require("http");
const fs = require("fs");
const emitter = require('events').EventEmitter;


let dateArray = fs.readdirSync("C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs");

let timeArray = (() => {
    var x = [];
    for (dateFolder of dateArray) {
        x.push(fs.readdirSync(`C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs\\${dateFolder}`));
    }
    return x;
})();

let fileNamesArray = (() => {
    var x = [];
    for (let i = 0; i < dateArray.length; i++) {
        if (timeArray[i].length == 1) {
            x.push(fs.readdirSync(`C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs\\${dateArray[i]}\\${timeArray[i]}`));
        } else if (timeArray[i].length > 1) {
            for (let j = 0; j < timeArray[i].length; j++) {
                x.push(fs.readdirSync(`C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs\\${dateArray[i]}\\${timeArray[i][j]}`));
            }
        }
    }
    return x;
})();

// array containing the exact path to each .log files.
let pathArray = (() => {
    var x = [];
    for (let i = 0; i < dateArray.length; i++) {
        if (timeArray[i].length == 1 && fileNamesArray[i].length >= 1) {
            x.push(`C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs\\${dateArray[i]}\\${timeArray[i]}\\${fileNamesArray[i]}`);
        } else if (timeArray[i].length > 1) {
            for (let j = 0; j < timeArray[i].length; j++) {
                for (let k = 0; k < fileNamesArray.length; k++) {
                    for (let l = 0; l < fileNamesArray[k].length; l++) {
                        // console.log(" i:",i, " j:",j, " k:",k, " l:",l)
                        if (x.indexOf(`C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs\\${dateArray[i]}\\${timeArray[i][j]}\\${fileNamesArray[k][l]}`) == -1) {
                            x.push(`C:\\Users\\monse\\AppData\\Local\\anywhere.app-logs\\${dateArray[i]}\\${timeArray[i][j]}\\${fileNamesArray[k][l]}`);
                        }
                    }
                }
            }
        }
    }
    return x;
})();

// to remove any file path that does not have a .log extention.
for(let i = 0; i < pathArray.length; i++){
    if(pathArray[i].length > 200 || pathArray[i].match(/zip/)){
        pathArray.splice(i, 1);
        
    }
}



http.createServer((req, res) => {
 
    if (req.url === "/") {
        fs.createReadStream("D:\\Mons\\Code Projects\\Node\\Task3-Show_logs\\index.html").pipe(res);
    }

    if (req.url === "/stringData") {
        // to remove change maxListener error throwing from createReadStream.pipe().
        emitter.setMaxListeners(pathArray.length); 
        for (let i = 1; i < pathArray.length; i++) {
            fs.createReadStream(pathArray[i]).pipe(res);
        }
    }
}).listen(80);
