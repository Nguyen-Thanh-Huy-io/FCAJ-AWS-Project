const fs = require('fs');
const path = require('path');

/**
 * Tự động tạo Bug ticket trên Jira khi Selenium Test thất bại
 * @param {string} summary Tiêu đề lỗi
 * @param {string} description Mô tả chi tiết lỗi
 * @param {string} screenshotPath Đường dẫn ảnh chụp màn hình lỗi (optional)
 */
async function reportBugToJira(summary, description, screenshotPath = null) {
  const JIRA_BASE_URL = process.env.JIRA_BASE_URL; // e.g. https://your-domain.atlassian.net
  const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
  const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
  const PROJECT_KEY = 'PB'; // Space key đã được cung cấp

  if (!JIRA_BASE_URL || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
    console.log('⚠️ Không tìm thấy đầy đủ cấu hình Jira API (JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN). Bỏ qua bước tạo Bug.');
    return null;
  }

  const authHeader = 'Basic ' + Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  const payload = {
    fields: {
      project: {
        key: PROJECT_KEY
      },
      summary: `[Selenium Test Fail] ${summary}`,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: description
              }
            ]
          }
        ]
      },
      issuetype: {
        name: 'Bug'
      }
    }
  };

  try {
    console.log(`🔌 Đang kết nối tới Jira API để tạo Bug cho dự án ${PROJECT_KEY}...`);
    
    // 1. Tạo issue Bug
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Jira API Create Issue failed: ${response.status} - ${errText}`);
    }

    const issueData = await response.json();
    const issueKey = issueData.key;
    console.log(`✅ Đã tạo thành công Bug ticket trên Jira: ${issueKey}`);

    // 2. Upload ảnh screenshot đính kèm nếu có
    if (screenshotPath && fs.existsSync(screenshotPath)) {
      console.log(`📎 Đang tải ảnh chụp màn hình lên ticket ${issueKey}...`);
      
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(screenshotPath);
      const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
      formData.append('file', fileBlob, path.basename(screenshotPath));

      const attachmentResponse = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/attachments`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'X-Atlassian-Token': 'no-check'
        },
        body: formData
      });

      if (!attachmentResponse.ok) {
        const errText = await attachmentResponse.text();
        console.error(`❌ Không thể đính kèm file lên Jira:`, errText);
      } else {
        console.log(`✅ Đã đính kèm ảnh chụp màn hình thành công.`);
      }
    }

    return issueKey;
  } catch (error) {
    console.error('❌ Lỗi khi tích hợp tạo Bug trên Jira:', error.message);
    return null;
  }
}

module.exports = { reportBugToJira };
