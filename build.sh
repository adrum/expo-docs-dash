set -e

# clean up previous remains, if any
rm -rf Contents/Resources
rm -rf Expo.docset
mkdir -p Contents/Resources/Documents

VERSION=`cat src/version`

# create a fresh sqlite db
cd Contents/Resources

# fetch the whole doc site
cd Documents

# -m = Turn on options suitable for mirroring.  This option turns on recursion and time-stamping, sets infinite recursion depth and keeps FTP directory listings.  It is currently equivalent to -r -N -l inf
# -p = This option causes Wget to download all the files that are necessary to properly display a given HTML page.  This includes such things as inlined images, sounds, and referenced stylesheets.
# -E = adjust extension
# -k = convert links
# -np = Do not ever ascend to the parent directory when retrieving recursively.  This is a useful option, since it guarantees that only the files below a certain hierarchy will be downloaded.
# wget -m -p -E -k -np http://docs.expo.io/
wget -d -v -m -p -E -k -np http://127.0.0.1:8000
