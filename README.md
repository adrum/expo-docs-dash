# [Expo](https://docs.expo.io/) documentation for [Dash](http://kapeli.com/dash)

## Installation in Dash

**To install the Expo documentation in Dash, go to:**

Preferences >> Downloads >> User Contributed

This repo is used to generate those docs. You don't need to touch it unless you want to contribute to it.

To update the docset, please read the instructions [here](https://github.com/Kapeli/Dash-User-Contributions#contribute-a-new-docset) (more specifically, "Set up your directory structure"). To generate the docset for your Dash-User-Contributions pull request, you'd use this repo.

**Note**: If you do wish to update the docset, please notify me by [opening an issue](https://github.com/adrum/expo-docs-dash/issues/new). I'd like to double check everything before you send it off to the Dash repo.

## Docset Manual Build Instructions

Prerequisites: wget, node and sqlite3. For OS X:

    brew install wget node sqlite3

We have to slightly modify the Expo docs to make it easier to format and parse for Dash. Additionally, it will be much quicker then hitting the network for all the pages.

### Expo Docs Setup Locally

1. Clone the Expo repo: git clone <https://github.com/expo/expo>
1. npm run setup:docs
1. Apply the patches in this repo's patches folder to that repo.
1. cd docs
1. yarn install
1. npm run export && npm run export-server

### Build Expo Dash Docs

1. Clone this repo: git clone <https://github.com/adrum/expo-docs-dash>
1. npm i
1. modify `src/version` with the current version
1. chmod +x build.sh
1. npm run build

The script will:

- Fetch the newest released Expo documentation from <http://127.0.0.1:8000/>.
- Parse the doc site into a new SQLite database for Dash. The list of files are hardcoded. Please check `src/index.js` for more detail.
- Bundle up the result in a Expo.docset.
- GZip for Dash contribution

Test the output by loading the Expo.docset (importing it into Dash).
