#!/bin/bash

# Script to clean up all .disabled files
# Usage: bash scripts/clean-disabled-examples.sh

echo "🧹 Cleaning up disabled examples..."

EXAMPLES_DIR="apps/docs/examples"
DISABLED_COUNT=$(find $EXAMPLES_DIR -name "*.disabled" | wc -l)

echo "Found $DISABLED_COUNT disabled files"

# Option 1: Delete all disabled files
delete_all() {
    echo "❌ Deleting all disabled files..."
    find $EXAMPLES_DIR -name "*.disabled" -delete
    echo "✅ All disabled files removed"
}

# Option 2: Move to backup directory
backup_all() {
    echo "📦 Moving disabled files to backup..."
    mkdir -p backup/disabled-examples
    find $EXAMPLES_DIR -name "*.disabled" -exec mv {} backup/disabled-examples/ \;
    echo "✅ All disabled files moved to backup/disabled-examples/"
}

echo "Choose an option:"
echo "1) Delete all .disabled files permanently"
echo "2) Move .disabled files to backup directory"
echo "3) Cancel"

read -p "Enter choice (1-3): " choice

case $choice in
    1) delete_all ;;
    2) backup_all ;;
    3) echo "Cancelled" ;;
    *) echo "Invalid choice" ;;
esac
