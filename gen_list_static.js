let walk = require('walk');
let fs = require('fs');
let files = [];

// Walker options
let walker = walk.walk('./public', {followLinks: false});

walker.on('file', function (root, stat, next) {
    if (stat.name !== "sw.js" && stat.name !== "static_files_list.js") {
        files.push(`${root}/${stat.name}`);
    }
    next();
});

walker.on('end', function () {
    files = files.map((file_path) => {
        return file_path.replace("./public", "");
    });
    fs.writeFileSync('./public/static_files_list.js', 'const staticList = ');
    fs.appendFileSync('./public/static_files_list.js', JSON.stringify(files));
    fs.appendFileSync('./public/static_files_list.js', ';');
});