const fs = require('fs');
const path = require('path');

function updateAcademyFooter(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // The exact string in the academy modules:
    const target = '© 2026 PDX HUB ACADEMY | MISSION CRITICAL VLSI EDUCATION';
    const updated = '© 2026 PDX HUB ACADEMY | BUILT BY YEGIREDDY PRANAY KUMAR';
    
    if (content.includes(target)) {
        content = content.replace(target, updated);
        fs.writeFileSync(filePath, content);
        console.log(`Academy Updated: ${filePath}`);
    } else {
        console.log(`Academy footer not found or already fixed: ${filePath}`);
    }
}

// Update all academy pages
if (fs.existsSync('academy')) {
    fs.readdirSync('academy').forEach(file => {
        if (file.endsWith('.html')) updateAcademyFooter(path.join('academy', file));
    });
}
