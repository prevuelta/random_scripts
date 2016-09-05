

function rebuildSite () {
    exec("npm run build", puts);
}

function RequestFactory (page) {
    return function (req, res) {
        res.sendFile(SITE_DIR + '/' + page + '.html')
    };
}

function saveJSON (raw, path, cb) {
    fs.writeFile(path, JSON.stringify( raw ), cb);
}