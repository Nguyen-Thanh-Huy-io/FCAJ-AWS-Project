require('dotenv').config();
const { encrypt, decrypt } = require('../src/utils/encryption');

function runTest() {
  console.log('--- Testing Encryption Utility ---');
  
  const originalToken = 'ya29.a0AfH6SMDIe-example-token-1234567890-abcdefghijklmnopqrstuvwxyz';
  console.log('Original Token:', originalToken);
  
  // Test encryption
  const encrypted = encrypt(originalToken);
  console.log('Encrypted Token:', encrypted);
  if (encrypted === originalToken) {
    throw new Error('Encryption returned plaintext!');
  }
  if (!encrypted.includes(':')) {
    throw new Error('Encrypted token does not match format (missing colons)!');
  }

  // Test decryption
  const decrypted = decrypt(encrypted);
  console.log('Decrypted Token:', decrypted);
  if (decrypted !== originalToken) {
    throw new Error(`Decryption failed! Expected: "${originalToken}", Got: "${decrypted}"`);
  }
  
  // Test fallback for unencrypted tokens
  console.log('\n--- Testing Plaintext Fallback ---');
  const legacyToken = 'legacy-plain-token';
  const decryptedLegacy = decrypt(legacyToken);
  console.log('Legacy (unencrypted) token Decrypted:', decryptedLegacy);
  if (decryptedLegacy !== legacyToken) {
    throw new Error('Fallback failed for raw unencrypted string!');
  }
  
  console.log('\n✅ All tests passed successfully!');
}

try {
  runTest();
} catch (e) {
  console.error('❌ Test failed:', e);
  process.exit(1);
}
