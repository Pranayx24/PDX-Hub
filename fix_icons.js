const fs = require('fs');
const path = require('path');

function fixFile(filePath, isSubdir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const prefix = isSubdir ? '../' : '';
    
    // The exact broken string we found:
    // <link rel=\"icon\" href=\"favicon.png\?v=1.0\" type=\"image/png\"><title>
    const broken = '<link rel=\\"icon\\" href=\\"favicon.png\\?v=1.0\\" type=\\"image/png\\"><title>';
    const fixed = `<link rel="shortcut icon" href="${prefix}pdx_chip.png?v=2.2"><link rel="manifest" href="${prefix}manifest_v2.json"><link rel="icon" href="${prefix}pdx_chip.png?v=2.2" type="image/png"><title>`;
    
    if (content.includes(broken)) {
        content = content.replace(broken, fixed);
        fs.writeFileSync(filePath, content);
        console.log(`Fixed: ${filePath}`);
    } else {
        console.log(`Already fixed or mismatch: ${filePath}`);
    }
}

// Fix root
fs.readdirSync('.').forEach(file => {
    if (file.endsWith('.html')) fixFile(file, false);
});

// Fix academy
if (fs.existsSync('academy')) {
    fs.readdirSync('academy').forEach(file => {
        if (file.endsWith('.html')) fixFile(path.join('academy', file), true);
    });
}
