#!/bin/bash

# Ask for version type
echo "What type of version update is this?"
echo "1) Patch (bug fixes) - x.x.X"
echo "2) Minor (new features) - x.X.x"
echo "3) Major (breaking changes) - X.x.x"
read -p "Enter choice (1-3): " choice

# Get the latest tag
current_version=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
current_version=${current_version#v}  # Remove 'v' prefix

# Split version into components
IFS='.' read -r major minor patch <<< "$current_version"

# Calculate new version
case $choice in
    1)
        new_version="v$major.$minor.$((patch + 1))"
        ;;
    2)
        new_version="v$major.$((minor + 1)).0"
        ;;
    3)
        new_version="v$((major + 1)).0.0"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Create commit and tag
read -p "Enter commit message: " commit_message

git add .
git commit -m "$commit_message"
git tag -a "$new_version" -m "Version $new_version"
git push origin main
git push origin --tags

echo "Successfully pushed version $new_version to GitHub"