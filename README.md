
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

### Create New Expo project

Run node install on the GreenUp app:
```
$ cd sites/GreenUpVermont
$ npm install
```

Then in Expo choose "open existing project", navigate to the GreenUp app root directory, and click "open".


