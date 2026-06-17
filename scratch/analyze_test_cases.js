const fs = require('fs');
const path = require('path');

const testCasesDir = path.join(__dirname, '../test_cases');
const files = fs.readdirSync(testCasesDir);

const testCases = [];
const bugs = [];

files.forEach(file => {
  const filePath = path.join(testCasesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (file.startsWith('TEAM_') && file.endsWith('.md')) {
    // Phân tích test case
    const idMatch = content.match(/TEAM_\d+/);
    const id = idMatch ? idMatch[0] : file.replace('.md', '');
    
    // Tìm Description (nằm giữa | Test Case Description | | ... |)
    // Cấu trúc dạng: | Test Case ID    | | TEAM_001 | Test Case Description | | Validate bắt buộc nhập Email khi gửi lời mời thành viên |
    const descParts = content.split('Test Case Description');
    let description = '';
    if (descParts.length > 1) {
      const parts = descParts[1].split('|');
      // Tìm phần tử không rỗng đầu tiên sau Test Case Description
      for (let i = 0; i < parts.length; i++) {
        const txt = parts[i].trim();
        if (txt && txt !== '' && txt !== 'Description') {
          description = txt;
          break;
        }
      }
    }
    
    // Tìm Pass/Fail/Not Executed
    // Dạng: | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass |
    const statusParts = content.split('Test Case (Pass/Fail/Not Executed, Crashed)');
    let status = 'Unknown';
    if (statusParts.length > 1) {
      const parts = statusParts[1].split('|');
      for (let i = 0; i < parts.length; i++) {
        const txt = parts[i].trim();
        if (txt && txt !== '') {
          status = txt;
          break;
        }
      }
    } else {
      // Thử tìm theo từ khóa Pass/Fail khác
      if (content.includes('| Pass |')) status = 'Pass';
      else if (content.includes('| Fail |')) status = 'Fail';
    }
    
    testCases.push({ id, file, description, status });
  } else if (file.startsWith('BUG_') && file.endsWith('.md')) {
    // Phân tích bug
    const id = file.replace('.md', '');
    const titleMatch = content.match(/Name\s*\|\s*(.*)/);
    const title = titleMatch ? titleMatch[1].trim().replace(/^\|\s*/, '').replace(/\|$/, '').trim() : '';
    
    const severityMatch = content.match(/Severity\s*\|\s*(.*)/);
    const severity = severityMatch ? severityMatch[1].trim().replace(/^\|\s*/, '').replace(/\|$/, '').trim() : '';
    
    const resolved = content.includes('RESOLVED') || content.includes('Resolved');
    
    bugs.push({ id, title, severity, resolved: resolved ? 'Resolved' : 'Open' });
  }
});

// Sắp xếp test cases theo ID
testCases.sort((a, b) => a.id.localeCompare(b.id));
bugs.sort((a, b) => a.id.localeCompare(b.id));

console.log("=== THỐNG KÊ TEST CASES (Tổng số: " + testCases.length + ") ===");
testCases.forEach(tc => {
  console.log(`- ${tc.id}: ${tc.status} | ${tc.description}`);
});

console.log("\n=== THỐNG KÊ BUGS (Tổng số: " + bugs.length + ") ===");
bugs.forEach(bug => {
  console.log(`- ${bug.id}: [${bug.severity}] [${bug.resolved}] ${bug.title}`);
});

// Phân bố trạng thái test cases
const passCount = testCases.filter(t => t.status.toLowerCase() === 'pass').length;
const failCount = testCases.filter(t => t.status.toLowerCase() === 'fail').length;
console.log(`\nTrạng thái: Pass: ${passCount} (${((passCount/testCases.length)*100).toFixed(1)}%), Fail: ${failCount} (${((failCount/testCases.length)*100).toFixed(1)}%)`);
