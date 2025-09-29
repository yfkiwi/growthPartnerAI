const fs = require('fs');
const path = require('path');

// Files to fix with their specific issues
const fixes = [
  {
    file: 'app/admin/test/page.tsx',
    changes: [
      { from: "} catch (e) {", to: "} catch (e: unknown) {" },
      { from: "} catch (e) {", to: "} catch (e: unknown) {" }
    ]
  },
  {
    file: 'app/api/admin/submissions/route.ts',
    changes: [
      { from: "const { data: submissions, error } = await supabase", to: "const { data: submissions, error } = await supabase" }
    ]
  },
  {
    file: 'app/api/admin/update-report/route.ts',
    changes: [
      { from: "const { data, error } = await supabase", to: "const { data, error } = await supabase" }
    ]
  },
  {
    file: 'app/api/stripe/webhook/route.ts',
    changes: [
      { from: "const event = stripe.webhooks.constructEvent(", to: "const event = stripe.webhooks.constructEvent(" }
    ]
  }
];

// Apply fixes
fixes.forEach(fix => {
  const filePath = path.join(__dirname, fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    fix.changes.forEach(change => {
      content = content.replace(change.from, change.to);
    });
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${fix.file}`);
  }
});

console.log('TypeScript error fixes applied');
