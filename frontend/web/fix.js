const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/Freelancing/IPPB/IP-RBISMS/frontend/web/src/pages');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('},\n  ,\n    { key: \'entryBy\'')) {
        content = content.replace(/},\n  ,\n    { key: 'entryBy'/g, '},\n    { key: \'entryBy\'');
        fs.writeFileSync(file, content);
        console.log('Fixed:', file);
    }
});
