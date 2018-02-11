
![Alt](/assets/images/app.png "Green Up Vermont Logo")
# Green Up Vermont
## A mobile app for Vermont's Green Up Day.
Green Up Vermont is an official Code for America Project which you can read about [here](http://codeforbtv.org/projects/greenup-app).

## Environment Setup
Here's the recommended environment setup on a mac.  The process for a windows machine should be roughly similar.  If you set up a windows machine, please add notes to this README with any variations you had to make on the following steps.

* NVM & Node
* Expo XDE
* iOS Simulator: XCode
* Android Simulator: Geni Motion (Free Edition)

### NVM & Node
If you haven't installed NVM & Node [here's a walkthrough](https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/)

If you're going to follow this env setup, then you will need to switch to node 7 for Expo:
```
$ nvm install 7
$ nvm use 7
Now using node v7.10.1 (npm v4.2.0)
```

### Expo
[Download the XDE here](https://expo.io/tools#xde)

### Download Repository
Assuming you've got git installed, just clone the repository:
```
$ git clone git@github.com:johnneed/GreenUpVermont.git
```

The app uses Google firebase for persistent storage, but for security reasons the configuration for firebase is not saved in the public git repository.

Go to the GreenUp slack channel and look at the pinned posts.  One of them will contain a firebase-config.js file you can use for development.  Copy this to the root of your project repo:
```
$ mv ~/Downloads/firebase-config.js ~/sites/GreenUpVermont/
```

### Run Geni Motion simulator
You can download the free edition of [geni motion here](https://www.genymotion.com/download/).

(Note that Geni Motion needs a virtual engine to run.  They recommend using virtualbox which [you can download here](https://www.virtualbox.org/wiki/Downloads).)

Geni Motion requires you to create an account to download their simulation, and also to actually use it.  After successfully starting Geni Motion it will prompt you to login.  Then you will be prompted to select a new "virtual device" (eg an android device).  Pick whatever suits you and give it a minute to download.

Find Genymotion’s copy of adb. On macOS this is normally /Applications/Genymotion.app/Contents/MacOS/tools/. Add the Genymotion tools directory to your path and makee sure that you can run adb from your terminal.

In order to do this, I added this line to my ~/.bash_profile:
`export PATH="/Applications/Genymotion.app/Contents/MacOS/tools:$PATH"         # android adb`
I confirmed the path addition this way:
```
$ source ~/.bash_profile
$ which adb
```

### Create New Expo project

Run node install on the GreenUp app:
```
$ cd sites/GreenUpVermont
$ npm install
```

Install expo globally:
`$ npm install -g exp`

Then run `$ exp path`. This will save your PATH environment variable so that XDE knows where to find your Android tools.

Then in the Expo XDE choose "open existing project", navigate to the GreenUp app root directory, and click "open".  Expo will now try to build your react native project. It's possible there will be some errors at this point so deal with them as they arise.  I expereinced these three errors, and found these solutions:
- Wrong version on npm was reported by XDE (appeared as an orange 'issue' alert)
  - I attempted to roll back to correct version with `$ npm install -g npm@4.6.1`.  Despite seeing v4.6.1 when I type `$ npm -v`, expo still reports me as running 5.6.0.
- Missing lodash dependency
  - I fixed this by running `$ yarn add lodash` and restarting the expo project

If all goes well, you should see expo display this message:
```
10:52:24 PM  Tunnel connected.
10:52:25 PM  Project opened! You can now use the "Share" or "Device" buttons to view your project.
```
You should also see a url displayed reading `exp://localhost:19001`.  If the protocol or host do not match, set them accordingly by clicking on the cog icon to the left of the url.
