#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read both JSON files
const duasPath = path.join(__dirname, 'src/data/duas.json');
const expandedPath = path.join(__dirname, 'src/data/expanded-duas.json');

const duas = JSON.parse(fs.readFileSync(duasPath, 'utf8'));
const expanded = JSON.parse(fs.readFileSync(expandedPath, 'utf8'));

// Merge categories
const mergedCategories = [
  ...duas.categories,
  ...expanded.categories
];

// Create merged structure
const merged = {
  version: "2.0.0",
  metadata: {
    total_categories: mergedCategories.length,
    total_duas: mergedCategories.reduce((sum, cat) => sum + (cat.duas?.length || 0), 0),
    supported_languages: ["en", "ar", "ur", "fr", "tr", "id", "bn", "ms", "ta", "ml"],
    last_updated: new Date().toISOString().split('T')[0]
  },
  categories: mergedCategories,
  languages: duas.languages
};

// Write merged file
fs.writeFileSync(duasPath, JSON.stringify(merged, null, 2), 'utf8');

console.log(`✅ Merged ${expanded.categories.length} categories from expanded-duas.json`);
console.log(`✅ Total categories: ${mergedCategories.length}`);
console.log(`✅ Total duas: ${merged.metadata.total_duas}`);
console.log(`✅ File saved to: ${duasPath}`);
