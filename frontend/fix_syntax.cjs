const fs = require('fs');
const path = require('path');

const dir = 'src/components/ui';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix React import
  if (content.includes('import * from "react"')) {
    content = content.replace(/import \* from "react"/g, 'import * as React from "react"');
    changed = true;
  }

  // 2. Fix Radix imports
  // Example: import * from "@radix-ui/react-accordion" -> import * as AccordionPrimitive from "@radix-ui/react-accordion"
  const radixRegex = /import \* from "@radix-ui\/react-([\w-]+)"/g;
  content = content.replace(radixRegex, (match, name) => {
    changed = true;
    const pascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    return `import * as ${pascalName}Primitive from "@radix-ui/react-${name}"`;
  });

  // 3. Remove TS type annotations in function signatures
  // Pattern: function Name({ ... }: Type) {
  const tsFuncRegex = /(function\s+\w+\s*\({[\s\S]*?}\s*):\s*[A-Z][\s\S]*?(?=\s*\{)/g;
  content = content.replace(tsFuncRegex, (match, group1) => {
    changed = true;
    return group1;
  });

  // 4. Fix cva calls (brute force fix for syntax)
  // Find cva(..., { variants, size }, defaultVariants }, );
  // This is very specific to what I saw in button.jsx
  if (content.includes('cva(')) {
    // Attempt to fix the broken object structure
    // Patterns like: { variants, size }, defaultVariants },
    content = content.replace(/\{\s*variants,?\s*size\s*\},\s*defaultVariants\s*\}/g, '{ variants: {}, defaultVariants: {} }');
    content = content.replace(/\{\s*variants\s*\},\s*defaultVariants\s*\}/g, '{ variants: {}, defaultVariants: {} }');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    fixFile(path.join(dir, file));
  }
});
