// http://localhost/C:/Users/monse/AppData/Local/anywhere.app-logs/17-Oct-2021/13-00/AnySnap.html-renderer
const http = require("http");
const fs = require("fs");
let url = '';
let path = '';

http.createServer((req, res) => {
    let tableString = "";

    if (req.url != "/stringData") {
        url = (req.url + ".log").replace(/\//, "");
        path = decodeURIComponent(url.replace(/\//g, "%5C%5C"));
        fs.createReadStream("D:\\Mons\\Code Projects\\Node\\Task3-Show_logs\\index.html").pipe(res);
    }

    if (req.url == "/stringData") {
        let myFile = ""
        let stream = fs.createReadStream(path);
        stream.on("data", (chunk) => {
            myFile += chunk;
        });
        stream.on("end", () => {
            // let dateArray = myFile.match(/\d\d[/]\d\d[/]\d\d/g);
            let timeArray = myFile.match(/\d\d[:]\d\d[:]\d\d/g);
            let logLevelArray = myFile.match(/error|warn|info|verbose|debug|silly/g);
            let logValueArray = myFile.match(/(?<=\:\')(.*)(?=\')/g);

            for (let i = 0; i < timeArray.length; i++) {
                tableString += "<tr>" + "<td>" + timeArray[i] + "</td>" + "<td>" + logLevelArray[i] + "</td>" + "<td>" + logValueArray[i] + "</td>" + "</tr>";
            }

            res.end(tableString);
        });
    }
}).listen(80);
