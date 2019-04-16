const router = require("express").Router()
// Home page
router.get("/", (_, res) => res.render("home", {title: "Home"}))
// router.get("/", (_, res) => res.render("allfiles", {title: "Routs"}))

// Upload
router.get("/upload", (_, res) => res.render("upload", {title: "Upload"}))

// Video content
router.get("/show", (_, res) => res.render("show", {title: "Show"}))

// About page
router.get("/about", (_, res) => res.render("about", {title: "About"}))

//Video
router.get("/video", (_, res) => res.render("video", {title: "Video"}))

// All content
router.get("/music", (_, res) => res.render("music", {title: "Music"}))

router.get("/explor", (_, res) => res.render("allfiles", {title: "explor"}))
router.get("/explor/*", (_, res) => res.render("allfiles", {title: "explor"}))


router.get("/player", (_, res) => res.render("player", {title: "player"}))
router.get("/control", (_, res) => res.render("control", {title: "Control"}))

module.exports = router
