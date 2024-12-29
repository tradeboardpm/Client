# Get the latest tag
$currentVersion = (git describe --tags --abbrev=0 2>$null) ?? "v0.0.0"
$currentVersion = $currentVersion.TrimStart('v')

# Split version into components
$versionParts = $currentVersion.Split('.')
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

# Ask for version type
Write-Host "What type of version update is this?"
Write-Host "1) Patch (bug fixes) - x.x.X"
Write-Host "2) Minor (new features) - x.X.x"
Write-Host "3) Major (breaking changes) - X.x.x"
$choice = Read-Host "Enter choice (1-3)"

# Calculate new version
switch ($choice) {
    "1" { $newVersion = "v$major.$minor.$($patch + 1)" }
    "2" { $newVersion = "v$major.$($minor + 1).0" }
    "3" { $newVersion = "v$($major + 1).0.0" }
    default { 
        Write-Host "Invalid choice"
        exit 1
    }
}

# Create commit and tag
$commitMessage = Read-Host "Enter commit message"

git add .
git commit -m $commitMessage
git tag -a $newVersion -m "Version $newVersion"
git push origin main
git push origin --tags

Write-Host "Successfully pushed version $newVersion to GitHub"