const express = require('express');
const http = require("http");
const router = express.Router()
const fs = require("fs");
const os = require('os');
const cors = require('cors');
const mediatag = require('jsmediatags');
const sharp = require("sharp");


const app = express();
app.use(cors())
const server = new http.Server(app);
server.listen(6655, () => console.log("server runing..."))

let platform = 'pc';
if (os.platform() === "win32")
    platform = 'pc';
else if (os.platform() === "android")
    platform = 'mobail';
else if (os.platform() === "linux")
    platform = 'linux';

// Supoted extention
const exts = {
    musics: ["mp3", "wma", "m4a"],
    videos: ["mp4", "avi", "mkv"],
    photos: ["jpg", "jpeg", "png"]
}

let prePath = os.homedir();

if (platform === 'pc')
    prePath = 'D:/'
else if (platform === 'mobail')
    prePath = '/storage/emulated/0/';

else if (platform === 'linux')
    prePath = '/home/media/';

app.use(express.static(prePath))

async function readFile(req, res) {
    let newList = {
        folder: [],
        musics: [],
        videos: [],
        photos: [],
        other: []
    }
    let files;
    try {
        files = fs.readdirSync(`${prePath}${req.body.path}`, { withFileTypes: true })
    } catch (err) {
        return res.json({ type: `file not found` });
    }
    files = files.filter(file => {
        if (/^\..*/.test(file.name)) return false
        else if (/AlbumArt/gi.test(file.name)) return false;

        else return true;
    })

    // Makeing folder Array
    newList.folder = files.filter(file => file.isDirectory())
        .map(file => file.name);

    // Adding to own type in files JSON Array
    for (type in exts) {
        function list(file, reg) {
            let name = file.name;
            if (reg.test(name)) {
                newList[type].push(name)
            }
        }
        function newListmake(ext) {
            const reg = new RegExp('\.' + ext + '$', "i")
            files.forEach(file => list(file, reg))
        }
        exts[type].forEach(newListmake)
    }

    // other files Array
    newList.other = files.filter(file => {
        const name = file.name;
        if (newList.folder.indexOf(name) !== -1) return false
        else if (newList.musics.indexOf(name) !== -1) return false
        else if (newList.videos.indexOf(name) !== -1) return false
        else if (newList.photos.indexOf(name) !== -1) return false;

        return true;
    }).map(file => file.name);

    res.json(newList);
}

/**
 * 
 * @MusicMetaData
 * sending by jsmediatags libary
 */
function sendMusicData(req, res) {
    const path = req.body.path;
    if (path) {
        let fullPath = `${prePath}${path}`;
        fullPath = fullPath.replace(/\/\//g, '/');
        mediatag.read(fullPath, {
            onSuccess: tag => {
                const data = {
                    album: tag.tags.album,
                    artist: tag.tags.artist,
                    title: tag.tags.title
                }
                res.json(data)
            },
            onError: err => res.json({
                "type": err.type,
                "info": err.info
            })
        });
    } else res.json({ type: 404, info: "req ont valid" })
}

/**
 * 
 * @MusicCover
 */
function sendCover(req, res) {
    const path = req.body.path;
    let fullPath = `${prePath}${path}`;
    fullPath = fullPath.replace(/\/\//g, '/');
    mediatag.read(fullPath, {
        onSuccess: tag => {
            let json = { ll: "not ok" };
            if (tag && tag.tags && tag.tags.picture && tag.tags.picture)
                if (tag.tags.picture.data) {
                    let ArrPicdata = tag.tags.picture.data
                    let buf = Buffer.from(ArrPicdata);
                    json = { buf, format: tag.tags.picture.format }
                }
            
            res.json(json)
    },
        onError: err => res.json({
            "type": err.type,
            "info": err.info
        })
    });
}
async function resizeImg(req, res) {
    try {
        const filePath = `${prePath}${req.params[0]}`;
        const semiTransparentRedPng = await sharp(fs.readFileSync(filePath))
            .resize({ width: 98, height: 98 })
            .png()
            .toBuffer();
        res.send(semiTransparentRedPng);
    } catch (err) {
        res.status(404).send('Some thing went roung');
    }
}

router.get('/imgthamp/*', resizeImg)
router.post('/allfiles', readFile)
router.post('/musicdata', sendMusicData)
router.post('/img', sendCover)

module.exports = router