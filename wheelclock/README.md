#Wheelclock

Demo: <http://mcdorians.github.com/jQuery-Plugins/wheelclockdemo.html>

##Getting started:

- import jquery
- import plugin
- import css and change it as you like to adjust the layout to your needs

##Options:
- mode: can be either 'clock' or 'stopwatch', default: 'clock
- running: if true then the clock is ticking, on false its stoped, default: true
- seconds: if true then the seconds count is displayed, default: true
- speed: value from 0 to 900, specifys the time for the rotation, default : 500

##Methods:
- toggle: toggles between running and not running
- reset: rests the clock depending on the mode. In clock-mode it return to the current system time an in stopwatch-mode it return to zero.
-destroy: unbinds the timer and clears the container
