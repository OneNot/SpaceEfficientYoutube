# SpaceEfficientYoutube
Space-efficient Youtube is a userscript for youtube, meant to be used with a browser extension like <a href="https://www.tampermonkey.net/">Tampermonkey</a>.<br>
Especially on high-res monitors the default youtube container is ridiculously narrow, but even on 1080p using the script can mean more videos on screen and less space wasted.</h3>

<a href="https://greasyfork.org/scripts/34388-space-efficient-youtube/code/Space-efficient%20Youtube.user.js">Click here to install</a>

<a href="https://greasyfork.org/en/scripts/34388-space-efficient-youtube">GreasyFork page</a>

<h2>Home page</h2>
<h4>Before - After</h4>
<img src="https://i.imgur.com/WOfotn5.png" width="320"> <img src="https://i.imgur.com/ruIz7XC.png" width="320">
- Option to hide the channel icons next to the videos on the home page from the settings.
<b>NOTE: Due to a YT update to how the home page renders videos, changing the thumbnail width using the script's methods leaves a bunch of empty space, so I decided to disable that part of the script by default. Therefore the thumbnail sizes on the home page will be as determined by vanilla YT, unless you turn the option back on from the settings.</b>
<hr>
<h2>Trending page</h2>
<h4>Before - After</h4>
<img src="https://i.imgur.com/YvtPF9i.png" width="320"> <img src="https://i.imgur.com/KZP8NnP.png" width="320">
<hr>
<h2>Subscriptions page</h2>
<h4>Before - After</h4>
<img src="https://i.imgur.com/jKH9v8l.png" width="320"> <img src="https://i.imgur.com/WU6MfcZ.png" width="320">
<hr>
<h2>Search page</h2>
<h4>Before - After</h4>
<img src="https://i.imgur.com/SgcmEtP.png" width="320"> <img src="https://i.imgur.com/juTf02G.png" width="320">
<hr>
<h2>Video page</h2>
<h4>Before - After</h4>
<img src="https://i.vgy.me/ufWVEH.png" width="320"> <img src="https://i.vgy.me/W5Swq9.png" width="320">
Choose how many columns of videos to show at what size.
Currently only affects Theater mode.
<hr>
<h2>Channel page</h2>
<h4>Before - After</h4>
<img src="https://i.imgur.com/kKvHHVR.png" width="320"> <img src="https://i.imgur.com/t64i8B7.png" width="320">
Now automatically expands video lists
<hr>
<h2>Old layout</h2>
<h4>Before - After</h4>
<img src="https://i.imgur.com/Aw0xjNL.jpg" width="320"> <img src="https://i.imgur.com/or9Qebj.jpg" width="320">
<hr>

Other Features:
- Set a bunch of video section and container sizing settings as you see fit
- Fade++ Compatible. (was. Not tested since many versions ago)
- Load high quality thumbnails on Subs/Trending pages

<h4>Find the settings in the Tampermonkey menu.</h4>
<img src="https://i.imgur.com/QQ3SShc.png">
<img src="https://i.imgur.com/UFpHzMU.png">
Hover over any option in the settings to get more info about it.


<h4>Known Problems</h4>
- The new chapter system hasn't been addressed in this script yet. The positioning of the chapter system's menu in video containers is a bit wonky and if you have not disabled the video "badges" (4K, CC, etc.), the chapter menu will go over the video container below. -> Partial workaround: disable video badges from the script's settings
- multi-column recommended videos are not working in non-theatre mode on video pages. -> Workaround: Use theater mode lol
- Video titles are cut short (title stops like this...) if the video container isn't large enough. -> Workaround: Set a larger video container width in script settings. Also, if you just want to know the full title of a video, you can hover over the title

Known problems will be fixed when I have time and motivation to do so.
