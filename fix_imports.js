const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src');

const mapping = {
    // Auth
    'auth.controller': 'auth', 'profile.controller': 'auth',
    'auth.service': 'auth', 'otp.service': 'auth', 'profile.service': 'auth',
    'user.repository': 'auth',
    'auth.routes': 'auth', 'profile.routes': 'auth',
    
    // Social
    'social.controller': 'social', 'inbox.controller': 'social',
    'youtube.service': 'social', 'google-oauth.service': 'social', 'inbox.service': 'social',
    'social-account.repository': 'social', 'inbox.repository': 'social',
    'social.routes': 'social', 'inbox.routes': 'social',
    
    // Workspace
    'brand.controller': 'workspace', 'team.controller': 'workspace', 'post.controller': 'workspace', 
    'livestream.controller': 'workspace', 'media-library.controller': 'workspace',
    'brand.service': 'workspace', 'team.service': 'workspace', 'post.service': 'workspace', 
    'livestream.service': 'workspace', 'media-library.service': 'workspace',
    'brand.repository': 'workspace', 'team.repository': 'workspace', 'post.repository': 'workspace', 
    'livestream.repository': 'workspace', 'media-library.repository': 'workspace',
    'brand.routes': 'workspace', 'team.routes': 'workspace', 'post.routes': 'workspace', 
    'livestream.routes': 'workspace', 'media-library.routes': 'workspace',
    
    // Admin
    'pricing.controller': 'admin', 'revenue.controller': 'admin', 'audit-log.controller': 'admin', 'product.controller': 'admin',
    'pricing.service': 'admin', 'revenue.service': 'admin', 'audit-log.service': 'admin', 'product.service': 'admin',
    'plan.repository': 'admin', 'plan-limit.repository': 'admin', 'revenue.repository': 'admin', 
    'audit-log.repository': 'admin', 'product.repository': 'admin',
    'pricing.routes': 'admin', 'revenue.routes': 'admin', 'audit-log.routes': 'admin', 'product.routes': 'admin',
    
    // Core
    'search.controller': 'core', 'notification.controller': 'core',
    'search.service': 'core', 'notification.service': 'core', 'email.service': 'core',
    'search.repository': 'core', 'notification.repository': 'core',
    'search.routes': 'core', 'notification.routes': 'core'
};

const domains = ['auth', 'social', 'workspace', 'admin', 'core'];
const types = ['controllers', 'services', 'repositories', 'routes'];

function getFiles(dir, allFiles = []) {
    if (!fs.existsSync(dir)) return allFiles;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, allFiles);
        } else if (name.endsWith('.js')) {
            allFiles.push(name);
        }
    }
    return allFiles;
}

const allFiles = getFiles(srcDir);

allFiles.forEach(filePath => {
    if (filePath.endsWith('app.js')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex to match require statements with relative paths
    const requireRegex = /require\(['"](\.\.?\/[^'"]+)['"]\)/g;

    const fileDir = path.dirname(filePath);
    const currentDomain = path.basename(fileDir);
    const parentDir = path.dirname(fileDir);
    const currentType = path.basename(parentDir);

    content = content.replace(requireRegex, (match, relPath) => {
        const parts = relPath.split('/');
        const fileNameWithExt = parts[parts.length - 1];
        const fileName = fileNameWithExt.replace('.js', '');
        
        // Find if target file is in our mapping
        const targetDomain = mapping[fileName];

        // Determine target type if possible from path
        let targetType = '';
        for (const type of types) {
            if (relPath.includes(`/${type}/`) || parts.includes(type)) {
                targetType = type;
                break;
            }
        }
        
        // If not in path, assume same type if it was a ./ import or if it's a domain file
        if (!targetType && targetDomain) {
            targetType = currentType;
        }

        if (targetDomain) {
            // Case 1: Import was ../type/file
            if (relPath.startsWith('../') && !relPath.startsWith('../../')) {
                if (domains.includes(currentDomain)) {
                    changed = true;
                    // Now it's ../../type/domain/file
                    return `require('../../${targetType}/${targetDomain}/${fileName}')`;
                }
            }
            
            // Case 2: Import was ./file
            if (relPath.startsWith('./')) {
                if (domains.includes(currentDomain)) {
                    if (currentDomain === targetDomain) {
                        // Same domain, stay ./file
                        return match;
                    } else {
                        // Different domain, now it's ../domain/file
                        changed = true;
                        return `require('../${targetDomain}/${fileName}')`;
                    }
                }
            }
        } else {
            // Non-domain files (middlewares, utils, config)
            if (relPath.startsWith('../')) {
                if (domains.includes(currentDomain)) {
                    if (relPath.includes('middlewares') || relPath.includes('utils') || relPath.includes('config')) {
                        // If it was ../middlewares, now it's ../../middlewares
                        if (!relPath.startsWith('../../')) {
                            changed = true;
                            return `require('../../${relPath.substring(3)}')`;
                        }
                    }
                }
            }
        }

        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${path.relative(srcDir, filePath)}`);
    }
});

console.log('Finished updating imports.');
