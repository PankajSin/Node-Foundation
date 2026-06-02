// In backend development, we use octal numbers to set Linux/macOS file permissions (read, write, and execute) when creating or modifying files.

// In POSIX permission systems, this specific access level is represented by the octal number 0o600

import fs from 'fs';

// 1. Define the secret content
const logData = 'SECURITY ALERT: Unauthorized access attempt detected.\n';

// 2. Write the file with explicit octal permissions
// 0o600 means: Owner can Read (4) + Write (2) = 6. Others get 0.
fs.writeFileSync('security.log', logData, { mode: 0o600 });

console.log('File created securely with 0o600 permissions!');

// 3. Let's verify the permissions using fs.statSync
const stats = fs.statSync('security.log');

// Grab just the permission bits and convert them back to an octal string
const permissions = (stats.mode & 0o777).toString(8);
console.log(`Verified file permissions on disk: 0o${permissions}`);
