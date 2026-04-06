const fs = require('fs');
const path = require('path');

function updateFooter(filePath, isSubdir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const prefix = isSubdir ? '../' : '';
    
    // 1. Add Legal Links to RESOURCES column
    const resourcesHeader = '<h5 style="color: var(--accent-color);">RESOURCES</h5>';
    const legalLinks = `\n                <a href="${prefix}about.html">About PDX Hub</a>\n                <a href="${prefix}privacy.html">Privacy Policy</a>\n                <a href="${prefix}terms.html">Terms of Service</a>\n                <a href="${prefix}contact.html">Contact Us</a>`;
    
    if (content.includes(resourcesHeader) && !content.includes('Privacy Policy')) {
        content = content.replace(resourcesHeader, resourcesHeader + legalLinks);
    }

    // 2. Add Founder Credits to IDENTITY
    const identityHeader = '© 2026 SILICON 2.0';
    const founderCredits = '© 2026 SILICON 2.0 | BUILT BY YEGIREDDY PRANAY KUMAR';
    
    if (content.includes(identityHeader) && !content.includes('YEGIREDDY')) {
        content = content.replace(identityHeader, founderCredits);
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated Footer: ${filePath}`);
}

// Update root
fs.readdirSync('.').forEach(file => {
    if (file.endsWith('.html')) updateFooter(file, false);
});

// Update academy
if (fs.existsSync('academy')) {
    fs.readdirSync('academy').forEach(file => {
        if (file.endsWith('.html')) updateFooter(path.join('academy', file), true);
    });
}
