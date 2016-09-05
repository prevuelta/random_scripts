
const ALLOWED_FILES = ['.jpg', '.png', '.gif', '.jpeg'];

/* FILES */
let multer = require('multer');
let glob = require('glob');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FILE_DIR);
    },
    filename: function (req, file, cb) {
        console.log(file);
        let name = path.parse(file.originalname).name;
        let ext = path.parse(file.originalname).ext;

        let fileName =  name + '_' + Date.now() + ext;
        cb(null, fileName);
    },
    fileFilter: function (req, file, cb) {
        if (!ALLOWED_FILES.includes(path.extension(file.originalname))) {
            return cb(new Error('File type not allowed'));
        }
        cb(null, true);
    }
});

let upload = multer({storage: storage});

/* ROUTES */
app.get('/media', function (req, res) {
    glob(FILE_DIR+'/*_THUMB*', {}, function (err, files) {
        res.send(files.map(p => {
            return {
                path: getFullPath(path.relative(FILE_DIR, p)),
                thumb : path.relative(FILE_DIR, p),
                features: im.identify({srcData: fs.readFileSync(p)})
            };
        }));
    });
});

app.del('/media', function (req, res) {
    console.log(req.body);
    console.log(req.params);
    console.log(req.data);
    // Arghhh...
});

app.post('/media', upload.single('file'), function (req, res, next) {

    let thumbnailPath = getThumbPath(req.file.filename);

    fs.writeFileSync(thumbnailPath, im.convert({
        srcData: fs.readFileSync(FILE_DIR+req.file.filename),
        format: 'JPG',
        quality: 70,
        width: 100,
        height: 100,
        resizeStyle: 'aspectfit'
    }));

    res.redirect('back');
});



/* -- HELPER FUNCTIONS --*/

function getThumbPath (filepath) {
    let name = path.parse(filepath).name;
    let ext = path.parse(filepath).ext;
    return FILE_DIR + name + '_THUMB' + ext;
}

function getFullPath (filepath) {
    return filepath.replace('_THUMB.', '.');
}