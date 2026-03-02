// VERIFICATION SCRIPT FOR DASHBOARD IMPLEMENTATION
// Run this with: node verify-implementation.js

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFYING DASHBOARD IMPLEMENTATION...\n');

// 1. Check if data.json is completely removed
const dataJsonPath = path.join(__dirname, 'app', 'dashboard', 'data.json');
if (fs.existsSync(dataJsonPath)) {
  console.log('❌ FAIL: data.json still exists at:', dataJsonPath);
  process.exit(1);
} else {
  console.log('✅ PASS: data.json successfully removed');
}

// 2. Check if MeDashboard component exists and has real data integration
const meDashboardPath = path.join(__dirname, 'components', 'me-dashboard.tsx');
if (!fs.existsSync(meDashboardPath)) {
  console.log('❌ FAIL: me-dashboard.tsx not found');
  process.exit(1);
}

const meDashboardContent = fs.readFileSync(meDashboardPath, 'utf8');
const requiredPatterns = [
  { pattern: 'refreshUser', description: 'refreshUser() call' },
  { pattern: 'GetMeResponse', description: 'TypeScript types' },
  { pattern: 'MeDashboardSkeleton', description: 'Skeleton UI' },
  { pattern: 'user.profile', description: 'Real session data mapping' },
  { pattern: 'meData.stats', description: 'Stats data mapping' },
  { pattern: 'meData.chart', description: 'Chart data mapping' }
];

console.log('\n📋 CHECKING MeDashboard.tsx:');
requiredPatterns.forEach(({ pattern, description }) => {
  if (meDashboardContent.includes(pattern)) {
    console.log(`✅ PASS: ${description}`);
  } else {
    console.log(`❌ FAIL: ${description} not found`);
  }
});

// 3. Check if skeleton component exists
const skeletonPath = path.join(__dirname, 'components', 'me-dashboard-skeleton.tsx');
if (fs.existsSync(skeletonPath)) {
  console.log('✅ PASS: Skeleton component exists');
} else {
  console.log('❌ FAIL: Skeleton component not found');
}

// 4. Check if dashboard-content.tsx is updated
const dashboardContentPath = path.join(__dirname, 'components', 'dashboard-content.tsx');
if (fs.existsSync(dashboardContentPath)) {
  const dashboardContent = fs.readFileSync(dashboardContentPath, 'utf8');
  if (dashboardContent.includes('DataTable')) {
    console.log('❌ FAIL: DataTable import still exists in dashboard-content.tsx');
  } else {
    console.log('✅ PASS: DataTable removed from dashboard-content.tsx');
  }
  
  if (dashboardContent.includes('refreshUser')) {
    console.log('✅ PASS: refreshUser added to dashboard-content.tsx');
  } else {
    console.log('❌ FAIL: refreshUser not found in dashboard-content.tsx');
  }
}

// 5. Check for any remaining data.json references
console.log('\n🔍 CHECKING FOR REMAINING data.json REFERENCES:');
function searchDirectory(dir, searchTerm) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(searchDirectory(filePath, searchTerm));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchTerm)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const dataJsonReferences = searchDirectory(__dirname, 'data.json');
if (dataJsonReferences.length === 0) {
  console.log('✅ PASS: No data.json references found');
} else {
  console.log('❌ FAIL: data.json references found in:');
  dataJsonReferences.forEach(ref => console.log(`   - ${ref}`));
}

console.log('\n🎯 VERIFICATION COMPLETE!');
console.log('\n📝 NEXT STEPS FOR VISUAL TESTING:');
console.log('1. Fix node_modules installation issues');
console.log('2. Run npm run dev');
console.log('3. Navigate to /me page');
console.log('4. Verify skeleton loading → real data transition');
console.log('5. Check browser Network tab for /api/users/me call');
console.log('6. Verify real user data displays correctly');
