set -e

rm -rf Expo.docset

VERSION=`cat src/version`
cd Contents/Resources
cd Documents

[ -d "127.0.0.1:8000" ] && mv 127.0.0.1\:8000 docs.expo.io

# move it around a bit
mkdir -p expo
[ -d "docs.expo.io" ] && mv docs.expo.io/* ./expo/
[ -d "docs.expo.io" ] && rm -rf docs.expo.io

# Cleanup some files
find ./expo/_next/static/chunks/pages/versions/ -mindepth 1 -maxdepth 1 -type d -not -name $VERSION -not -name latest -exec rm -rf '{}' \;
find ./expo/versions -mindepth 1 -maxdepth 1 -type d -not -name $VERSION -not -name latest -exec rm -rf '{}' \;
rm -f ./expo/robots.txt

cd ../../../

# create data file from base index page
node src/createSectionJSON.js

# Add page sections
node src/createPageSectionJSON.js

# change the documentation markup layout a bit to fit dash's small window
node src/modifyDocsHTML.js

# read the previously fetched doc site and parse it into sqlite
node src/index.js

# Create plist
cat > Contents/Info.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleIdentifier</key>
	<string>expo</string>
	<key>CFBundleName</key>
	<string>Expo</string>
	<key>DocSetPlatformFamily</key>
	<string>expo</string>
    <key>DashDocSetFamily</key>
    <string>dashtoc</string>
	<key>dashIndexFilePath</key>
	<string>expo/versions/$VERSION/index.html</string>
	<key>isDashDocset</key>
	<true/>
</dict>
</plist>
EOF

# bundle up!
mkdir Expo.docset
cp -r Contents Expo.docset
cp src/icon* Expo.docset

# Create gzip bundle for Dash Contribution
tar --exclude='.DS_Store' -cvzf expo.tgz Expo.docset

