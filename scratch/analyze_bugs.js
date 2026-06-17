const fs = require('fs');
const path = require('path');

const testCasesDir = path.join(__dirname, '../test_cases');
const files = fs.readdirSync(testCasesDir);

const bugs = [];

files.forEach(file => {
  if (file.startsWith('BUG_') && file.endsWith('.md')) {
    const filePath = path.join(testCasesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const id = file.replace('.md', '');
    
    // Parse Name
    const nameMatch = content.match(/Name\s*\|\s*(.*)/);
    const name = nameMatch ? nameMatch[1].trim().replace(/^\|\s*/, '').replace(/\|$/, '').trim() : '';
    
    // Parse Severity
    const severityMatch = content.match(/Severity\s*\|\s*(.*)/);
    const severity = severityMatch ? severityMatch[1].trim().replace(/^\|\s*/, '').replace(/\|$/, '').trim() : '';
    
    // Parse Root Cause
    const rootCauseMatch = content.match(/\*\*Root Cause:\*\*\s*(.*)/i);
    const rootCause = rootCauseMatch ? rootCauseMatch[1].trim() : '';
    
    // Parse Fix Applied
    const fixAppliedMatch = content.match(/\*\*Fix Applied:\*\*([\s\S]*?)\*\*Verified By:\*\*/i);
    let fixApplied = '';
    if (fixAppliedMatch) {
      fixApplied = fixAppliedMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    } else {
      const altFixMatch = content.match(/\*\*Fix Applied:\*\*([\s\S]*)$/i);
      fixApplied = altFixMatch ? altFixMatch[1].trim() : '';
    }
    
    bugs.push({ id, name, severity, rootCause, fixApplied });
  }
});

bugs.sort((a, b) => a.id.localeCompare(b.id));

console.log(JSON.stringify(bugs, null, 2));
