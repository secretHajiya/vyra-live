# VYRA LIVE (Expo)

## Build the APK
1. Install Node 18+, then: `npm install -g eas-cli`
2. In this folder: `npm install`
3. `eas login` (free Expo account)
4. `eas build -p android --profile preview`
5. Download the APK from the link EAS prints.

## Publish to GitHub
`git init && git add . && git commit -m "VYRA LIVE" && git remote add origin <your-repo-url> && git push -u origin main`
Then put your repo URL in `GITHUB_URL` inside App.tsx.

Ads use Google's test banner in development and your real unit ID in release builds.
