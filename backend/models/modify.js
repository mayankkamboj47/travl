const fs = require('fs').promises;

const readJSON = (path) => {
    return fs.readFile(path, 'utf8')
        .then((data) => {
        return JSON.parse(data);
        })
        .catch((err) => {
        console.log(err);
        });
    }

const writeJSON = (path, data) => {
    return fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');
}

const changeID = data => {
    data = data.map((r)=>{
        r.id = r._id;
        delete r._id;
        return r;
    });
    return data;
};
readJSON('./models/hosts.json').then(changeID).then(data => writeJSON('./models/hosts.json', data));
readJSON('./models/listings.json').then(changeID).then(data => writeJSON('./models/listings.json', data));