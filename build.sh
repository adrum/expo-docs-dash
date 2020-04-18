set -e

# clean up previous remains, if any
rm -rf Contents/Resources
rm -rf Expo.docset
mkdir -p Contents/Resources/Documents

VERSION=`cat src/version`

# create a fresh sqlite db
cd Contents/Resources
sqlite3 docSet.dsidx 'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'
sqlite3 docSet.dsidx 'CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path)'

# fetch the whole doc site
cd Documents
# wget -m -p -E -k -np http://docs.expo.io/
wget -m -p -E -k -np http://127.0.0.1:8000 && mv 127.0.0.1:8000 docs.expo.io


# move it around a bit
mkdir -p expo
mv docs.expo.io/* ./expo/
rm -rf docs.expo.io

# Cleanup some files
find ./expo/versions -mindepth 1 -maxdepth 1 -type d -not -name $VERSION -exec rm -rf '{}' \;
rm ./expo/versions/index.html ./expo/robots.txt ./expo/index.html

cd ../../../

# create data file from base index page
node src/createSectionJSON.js

# change the documentation markup layout a bit to fit dash's small window
node src/modifyDocsHTML.js

# read the previously fetched doc site and parse it into sqlite
node src/index.js

# Create plist
cat > Contents/Info.plist << EOF <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleIdentifier</key>
	<string>expo</string>
	<key>CFBundleName</key>
	<string>Expo</string>
	<key>DocSetPlatformFamily</key>
	<string>expo</string>
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
