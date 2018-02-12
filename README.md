A Very simple weather App
====================

# Installation
1. clone `[git@github.com:odedshr/weatherApp.git](git@github.com:odedshr/weatherApp.git)` to you local computer
2. run `npm install` to get node modules

# Usage
- use `npm start` to start a local web server and then access the web-app via localhost on `[http://127.0.0.1:8000](http://127.0.0.1:8000)`
- use `npm test` to run unit tests

# Potential Improvements
- Given more time, the first element to improve would be having the indices appear more clickable
- Other major improvements are less technological and more visual - larger collection of background images for finer
  resolution of weather description; better-looking icons; better use of SVG icons and change their color.
- Possible technological improvements that would take more than 4 hours to implement would be a weekly chart of the
  temperature (not that long but I couldn't be bothered with the styling); notifications for index change passing
  thresholds (for example surfers would like to know that wind is above X and temprature is within range Y)

# Considerations
- When given the option, I prefer to use vanillaJS. Although having experience with Angualr, VueJS and little experience
  with React, I feel that small applications don't require such heavy tool while big applications should probably come up
  with their own custom-tailored solution.
- I used modern ES6 syntax and tried running the app on latest chrome (test run on latest Node.js); For older browsers
  support I would use babel to transpile my code (and minify/uglify it); but for the sake of this demo, I deemed it
  unnecessary to come up with a code-building mechanism. If I was asked to do so, I would use WebPack.
- Initially thinking of using font-icons for the index icons, I stumbled on a post claiming that font-icons are bad for
  accessibility as text-to-speech readers don't know how to handle them. Using SVG, albeit limiting seemed like a quick
  solution fitting for 4hr work this project was meant to be; In truth, font-icons can be used in CSS' `:before` and
  `:after` without causing problem with readers.
- I have experience working with RedHat OpenShift, Heroku and AWS but I didn't see a reason to spend time putting the
  application on it. it is avaialble at [https://odedshr.github.io/weatherApp/index.html](https://odedshr.github.io/weatherApp/index.html)
