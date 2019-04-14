const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")
const mediatag = require("jsmediatags")


const app = express()
const exts = {
	musics: ["mp3", "wma"],
	videos: ["mp4", "avi", "mkv"],
	photos: ["jpg", "jpeg", "png"]
}

let newList = {
	musics: [],
	videos: [],
	photos: []
}
// parse various different custom JSON types as JSON
app.use(bodyParser.json({
	type: "application/json",
}))

// parse an HTML body into a string
app.use(bodyParser.text({
	type: "text/html",
}))

const uploadFile = files => {
	const { file } = files;
	const fileName = path.join(__dirname, "../", "public", "content/") + file.name;
	file.mv(fileName, err => {
		if (err) console.log(err, file);
	});
}

const sendData = (link, res) => {
	mediatag.read(Content + link, {
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
}

const Content = path.join(__dirname, "../", "public", "content/")

const filterdata = (link, res) => {
	mediatag.read(Content + link, {
		onSuccess: tag => {
			let picdata = tag.tags.picture.data
			buf = Buffer.from(picdata)
			res.json(buf)
		},
		onError: err => res.json({
			"type": err.type,
			"info": err.info
		})
	});
}
const readfiles = () => {
	newList = {
		musics: [],
		videos: [],
		photos: []
	}
	const readed = (err, items) => {
		if (err) return console.log(err)
		
		const list = (v, g, reg) => {
			if (reg.test(v)) {
				newList[i].push(v)
				items.splice(g, 1)
			}
		}
		const newListmake = a => {
			const reg = new RegExp(a + '$', "i")
			items.forEach((v, g) => list(v, g, reg))
		}
		
		for (i in exts) {
			exts[i].forEach(newListmake)
		}
	}
	fs.readdir(Content, readed)
}
readfiles()
setInterval(readfiles, 60000)

router.get("/getfiles", (req, res) => {
	res.json(newList)
})

router.get("/img/:name", (req, res) => {
	filterdata(req.params.name, res)
})

router.get("/mdata/:name", (req, res) => {
	sendData(req.params.name, res)
})

router.post("/upload", (req, res) => {
	if (req.files) {
		uploadFile(req.files)
	}
	res.json({
		status: "secseced",
	})
})

module.exports = router