// ==UserScript==
// @name        Space-efficient Youtube
// @namespace   1N07
// @author      1N07
// @icon        https://i.imgur.com/VgEiyi3.png
// @icon64      https://i.imgur.com/VgEiyi3.png
// @description AKA: "Wide Youtube", AKA: "Wide video container" - Uses the page space on youtube more efficiently (especially good for high resolutions)
// @include     https://www.youtube.com/*
// @version     2.2.3
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

(function() {

    if(true)
    {
        var configCSS = `
			#SEYConfig {
				width: 320px !important;
				height: 670px !important;
				max-height: 100% !important;
				border: none !important;
				border-radius: 0 0 0 20px !important;
				box-shadow: black -1px 1px 20px;
				position: fixed !important;
				top: 0 !important;
				right: 0 !important;
				left: unset !important;
				background: #383838 !important;
			}

			#SEYConfig_wrapper
			{
				padding: 10px;
				background-color: #212121;
				color: white;
				background-color: transparent;
			}

			#SEYConfig .config_var
			{
				padding: 1px 20px;
			}

			#SEYConfig input
			{
				background-color: #181818;
				color: white;
				border: none;
				float: left;
				margin-right: 5px;
			}

			#SEYConfig input[type="text"]
			{
				width: 40px;
				text-align: center;
			}

			#SEYConfig input[type="checkbox"]
			{
				filter: invert(90%);
			}

			#SEYConfig .saveclose_buttons
			{
				background-color: #181818;
				color: white;
				border-color: gray;
			}

			#SEYConfig .section_header {
				background: #202020;
				margin-bottom: 5px;
			}

			#SEYConfig .section_header_holder {
				margin-top: 8px;
				background-color: rgba(0,0,0,0.3);
				padding: 0 0 5px 0;
				border-radius: 0 0 10px 10px;
			}

			#SEYConfig_resetLink { color: white !important; }
		`;
    }

    var frame = document.createElement('div');
    frame.id = "test";
    document.body.appendChild(frame);

    GM_config.init(
        {
            'id': 'SEYConfig', // The id used for this instance of GM_config
            'title': 'Space-efficient Youtube Config',
            'fields': // Fields object
            {
                'FPPCompOn': // This is the id of the field
                {
                    'section': 'Fade++',
                    'label': 'Fade++ compatibility mode', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': false // Default value if user doesn't change it
                },

                'HomeVideoContainerWidth':
                {
                    'section': 'Home page',
                    'label': 'Video container width',
                    'title': 'The width of the container which includes both the thumbnail and the title/other info',
                    'type': 'unsigned float',
                    'default': '360'
                },
                'ShowChannelIconNextToVideosOnHomePage':
                {
                    'label': 'Show channel icon in video container',
                    'type': 'checkbox',
                    'default': true
                },

                'SubVideoContainerWidth':
                {
                    'section': 'Subscriptions page',
                    'label': 'Video container width',
                    'title': 'The width of the container which includes both the thumbnail and the title/other info',
                    'type': 'unsigned float',
                    'default': '210'
                },

                'TrendingVideoContainerWidth':
                {
                    'section': 'Trending page',
                    'label': 'Video container width',
                    'title': 'The width of the container which includes both the thumbnail and the title/other info',
                    'type': 'unsigned float',
                    'default': '600'
                },
                'TrendingVideoContainerHeight':
                {
                    'label': 'Video container height',
                    'title': 'The height of the container. This directly affects thumnail size and how much space is left for the other info',
                    'type': 'unsigned float',
                    'default': '138'
                },

                'HQTN':
                {
                    'section': 'Subscriptions & Trending pages',
                    'label': 'Load high quality thumbnails',
                    'title': 'The default thumbnail resolution is fitted for the default video container size, so if you use defaults(or smaller) there is no need to enable this.',
                    'type': 'checkbox',
                    'default': false
                },

                'SearchVideoContainerWidth':
                {
                    'section': 'Search results page',
                    'label': 'Video container width',
                    'title': 'The width of the container which includes both the thumbnail and the title/other info',
                    'type': 'unsigned float',
                    'default': '600'
                },
                'SearchVideoContainerHeight':
                {
                    'label': 'Video container height',
                    'title': 'The height of the container. This directly affects thumnail size and how much space is left for the other info',
                    'type': 'unsigned float',
                    'default': '200'
                },
                'HideSearchVideoBadges':
                {
                    'label': 'Hide video badges',
                    'title': 'Hides the little badges like New/4K/CC etc. on the video containers leaving more space for the description',
                    'type': 'checkbox',
                    'default': false
                },

                'AutoExpandChannelVidContainers':
                {
                    'section': 'Channel pages',
                    'label': 'Auto-expand horizontal video lists',
                    'type': 'checkbox',
                    'default': false
                }
            },
            'frame': frame,
            'css': configCSS
        }
    );

    //GM_config.open();


    //===== SETTINGS =====//
    var FPPHandle;
    var FPPCompOn = GM_getValue("FPPCompOn", false);
    SetFPPHandle();

    var HomeVideoContainerWidthHandle;
    var HomeVideoContainerWidth = CleanNumber(GM_getValue("HomeVideoContainerWidth", "360"));
    SetHomeVideoContainerWidthHandle();

    var ShowChannelIconNextToVideosOnHomePageHandle;
    var ShowChannelIconNextToVideosOnHomePage = GM_getValue("ShowChannelIconNextToVideosOnHomePage", true);
    SetShowChannelIconNextToVideosOnHomePageHandle();

    var SubVideoContainerWidthHandle;
    var SubVideoContainerWidth = CleanNumber(GM_getValue("SubVideoContainerWidth", "210"));
    SetSubVideoContainerWidthHandle();

    var TrendingVideoContainerWidthHandle;
    var TrendingVideoContainerWidth = CleanNumber(GM_getValue("TrendingVideoContainerWidth", "600"));
    SetTrendingVideoContainerWidthHandle();

    var TrendingVideoContainerHeightHandle;
    var TrendingVideoContainerHeight = CleanNumber(GM_getValue("TrendingVideoContainerHeight", "138"));
    SetTrendingVideoContainerHeightHandle();

    var HQTNHandle;
    var HQTN = GM_getValue("HQTN", false);
    SetHQTNHandle();

    var SearchVideoContainerWidthHandle;
    var SearchVideoContainerWidth = CleanNumber(GM_getValue("SearchVideoContainerWidth", "600"));
    SetSearchVideoContainerWidthHandle();

    var SearchVideoContainerHeightHandle;
    var SearchVideoContainerHeight = CleanNumber(GM_getValue("SearchVideoContainerHeight", "200"));
    SetSearchVideoContainerHeightHandle();

    var HideSearchVideoBadgesHandle;
    var HideSearchVideoBadges = GM_getValue("HideSearchVideoBadges", false);
    SetHideSearchVideoBadgesHandle();

	var AutoExpandChannelVidContainersHandle;
    var AutoExpandChannelVidContainers = GM_getValue("AutoExpandChannelVidContainers", true);
    SetAutoExpandChannelVidContainersHandle();

    //===== SETTINGS END =====//


    const ratioMultiplier = 16 / 9;
    var screenWidth = screen.width;
    if(!!document.getElementById("early-body")) { //if old youtube
        document.getElementById("content").setAttribute("style", "width: 99%;");
    } else { //new youtube
        //Main container width and padding
        if(true) {
            addGlobalStyle(`
				/*search*/
				ytd-search ytd-two-column-search-results-renderer.ytd-search,
				ytd-search ytd-two-column-search-results-renderer.ytd-search > #primary,
				/*home*/
				ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer,
				/*other*/
				ytd-browse > ytd-two-column-browse-results-renderer.ytd-browse
				{
					width: 100% !important;
					max-width: 100% !important;
				}

				ytd-browse > ytd-two-column-browse-results-renderer.ytd-browse > #primary,
				ytd-search
				{
					padding: 16px;
				}
			`);
        }

		//vertical lists to horizontal grid / video container sizing
		if(true) {
			//trending
			if(true) {
				addGlobalStyle(`
					/*container*/
					#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer
					{
						display: inline-block;
						width: `+TrendingVideoContainerWidth+`px;
						height: `+TrendingVideoContainerHeight+`px;
					}
					#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer > #dismissable
					{
						width: 100%;
						height: 100%;
					}

					/*thumnail container*/
					#grid-container.ytd-expanded-shelf-contents-renderer > ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail.ytd-video-renderer,
					#grid-container.ytd-expanded-shelf-contents-renderer > ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail
					{
						height: 100%;
						width: `+(TrendingVideoContainerHeight * ratioMultiplier)+`px;
					}

					/*thumnail shadow and image*/
					#grid-container.ytd-expanded-shelf-contents-renderer > ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
					{
						height: 100% !important;
						width: 100% !important;
					}
				`);
			}

			//search
			if(true) {
				addGlobalStyle(`
					/*container*/
					ytd-search ytd-video-renderer, ytd-search ytd-channel-renderer, ytd-search ytd-radio-renderer, ytd-search ytd-playlist-renderer
					{
						display: inline-block;
						width: `+SearchVideoContainerWidth+`px;
						height: `+SearchVideoContainerHeight+`px;
						box-sizing: border-box;
					}
					ytd-search ytd-video-renderer > #dismissable
					{
						width: 100%;
						height: 100%;
					}

					/*thumnail container*/
					ytd-search ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer,
					ytd-search ytd-radio-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-radio-renderer,
					ytd-search ytd-playlist-renderer[use-prominent-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer
					{
						max-width: none;
						min-width: none;
						height: 100%;
						width: `+(SearchVideoContainerHeight * ratioMultiplier)+`px;
						-ms-flex: none;
						-webkit-flex: none;
						flex: none;
					}
					ytd-search ytd-radio-renderer.ytd-item-section-renderer,
					ytd-search ytd-playlist-renderer.ytd-item-section-renderer
					{
						display: flex;
					}

					/*thumnail shadow and image*/
					ytd-search ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
					ytd-search ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
					{
						width: 100%;
						height: 100%;
					}

					/*other*/
					ytd-search #description-text.ytd-video-renderer
					{
						margin-bottom: 2px;
					}
					ytd-search ytd-video-renderer > #dismissable #channel-info
					{
						padding: 2px 0 0 0;
					}
					ytd-search #description-text.ytd-video-renderer
					{
						max-height: none;
					}
					`+(HideSearchVideoBadges ? `ytd-search ytd-badge-supported-renderer { display: none; }` : ``)+`

					/*channel thumnail container*/
					ytd-search #avatar.ytd-channel-renderer,
					ytd-search ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer .channel-link.ytd-channel-renderer,
					ytd-search ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer
					{
						width: min-content;
						width: -moz-min-content;
						flex: none;
						max-width: none;
						min-width: 0;
					}
				`);
			}

			//home
			if(true) {
				addGlobalStyle(`
					/*container*/
					ytd-browse[page-subtype="home"] ytd-rich-item-renderer
					{
						width: `+HomeVideoContainerWidth+`px;
					}
					`+(ShowChannelIconNextToVideosOnHomePage ? `` : `ytd-browse[page-subtype="home"] #avatar-link.ytd-rich-grid-media { display: none; }`)+`
				`);
			}

			//subs
			if(true) {
				addGlobalStyle(`
					/*container*/
					ytd-browse[page-subtype="subscriptions"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer
					{
						width: `+SubVideoContainerWidth+`px;
					}

					/*thumnail container*/
					ytd-browse[page-subtype="subscriptions"] ytd-thumbnail.ytd-grid-video-renderer
					{
						width: `+SubVideoContainerWidth+`px;
						height: `+(SubVideoContainerWidth / ratioMultiplier)+`px;
					}

					/*thumnail shadow and image*/
					ytd-browse[page-subtype="subscriptions"] ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
					ytd-browse[page-subtype="subscriptions"] ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail > img
					{
						width: 100%;
						height: 100%;
					}
				`);
			}
		}

		//video container padding/margin
		if(true) {
			//trending
			if(true) {
				addGlobalStyle(`
					#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer
					{
						padding: 0 10px 0 0;
					}
					#grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer:not(:last-child)
					{
						margin: 0 0 10px 0;
					}
				`);
			}

			//search
			if(true) {
				addGlobalStyle(`
					ytd-search ytd-video-renderer.ytd-item-section-renderer,
					ytd-search ytd-channel-renderer.ytd-item-section-renderer,
					ytd-search ytd-radio-renderer.ytd-item-section-renderer,
					ytd-search ytd-playlist-renderer.ytd-item-section-renderer,
					ytd-search #items.ytd-vertical-list-renderer > .ytd-vertical-list-renderer
					{
						padding: 0 10px 0 0;
						margin: 10px 0 0 0;
					}
					ytd-search ytd-shelf-renderer.ytd-item-section-renderer
					{
						margin: 10px 0 0 0;
					}
				`);
			}

			//home
			if(true) {
				addGlobalStyle(`
					ytd-browse[page-subtype="home"] ytd-rich-item-renderer
					{
						margin: 0 5px 20px 5px;
					}
					ytd-browse[page-subtype="home"] ytd-rich-section-renderer
					{
						margin: 0;
					}
				`);
			}

			//subs
			if(true) {
				addGlobalStyle(`
					ytd-browse[page-subtype="subscriptions"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer
					{
						margin: 0 5px 15px 0;
					}
				`);
			}
		}

        //channel page horizontal list arrow visibility
		if(true) {
			addGlobalStyle(`
				yt-horizontal-list-renderer[at-start] #left-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer,
				yt-horizontal-list-renderer[at-end] #right-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer
				{
					display: block;
					opacity: 1;
				}
			`);
		}

        if(HQTN) {
            addGlobalStyle(`
				img.yt-img-shadow:not([src*='?'])
				{
					object-fit: cover;
				}
			`);
        }
        if(FPPCompOn) {
			addGlobalStyle(`
				/*========== Fade++ Compatibility ==========*/
				ytd-app #page-manager > ytd-browse:not([page-subtype="playlist"]) {
					display: block;
				}
				ytd-app[guide-persistent-and-visible] #page-manager > ytd-browse:not([page-subtype="playlist"]) ytd-two-column-browse-results-renderer.ytd-browse
				{
					margin-left: 250px !important;
				}
			`);
            //console.log("Youtube Wide video container Fade++ compatibilty style added to DOM");
        }
    }

    if(AutoExpandChannelVidContainers || HQTN)
    {
        var lastCheckedURL = window.location.href;
        URLChanged(); //for initial page load

        //poll for url changes
        setInterval(function(){
            if(lastCheckedURL != window.location.href)
            {
                lastCheckedURL = window.location.href;
                URLChanged();
            }
        }, 200);
        var waitForArrows, waitForSubsThumbnails;
    }
    /*============================================================*/

    function AutoExpandContainers()
    {
        clearInterval(waitForArrows);

        //=== clear potential old containers ===//
        let expandedEls = document.getElementsByClassName("expanded-wwc");
        //console.log("expanded els found: " + expandedEls.length);
        let numRemoved = 0;

        //seems to always remove exactly half of them only, for some reason. So I guess do this until all have been removed
        while(expandedEls.length > 0)
        {
            for(let x = 0; x < expandedEls.length; x++)
            {
                if(!!expandedEls[x])
                {
                    expandedEls[x].classList.remove("expanded-wwc");
                    //console.log(++numRemoved + " cleared");
                }
            }
            expandedEls = document.getElementsByClassName("expanded-wwc");
        }
        //=== old containers cleared ===//

        //=== unmark container arrows marked as clicked ===//
        numRemoved = 0;
        let clickedArrows = document.getElementsByClassName("clicked");
        //console.log("clicked found: " + clickedArrows.length);
        while(clickedArrows.length > 0)
        {
            for(let x = 0; x < clickedArrows.length; x++)
            {
                if(!!clickedArrows[x])
                {
                    clickedArrows[x].classList.remove("clicked");
                    //console.log(++numRemoved + " cleared");
                }
            }
            clickedArrows = document.getElementsByClassName("clicked");
        }
        //=== all arrows unmarked ===//
        //console.log("-expandedclear-");

        //check that we are on a page that can have containers
        if(lastCheckedURL.includes("/user/") || lastCheckedURL.includes("/channel/"))
        {
            //poll for untouched containers
            waitForArrows = setInterval(function(){
                //console.log("-searching...-");
                let arrowsRight = document.querySelectorAll("yt-horizontal-list-renderer:not(.expanded-wwc) > #right-arrow > ytd-button-renderer.arrow");
                let arrowsLeft = document.querySelectorAll("yt-horizontal-list-renderer:not(.expanded-wwc) > #left-arrow > ytd-button-renderer.arrow");
                if(!!arrowsRight && arrowsRight.length > 0 && !!arrowsLeft && arrowsLeft.length > 0)
                {
                    //console.log("-found "+arrowsRight.length+"-");
                    //do the thing for found untouched containers and mark them
                    for(let i = 0; i < arrowsRight.length; i++)
                    {
                        if(!!arrowsRight[i] && arrowsRight[i].offsetParent !== null && !!arrowsLeft[i] && arrowsLeft[i].offsetParent !== null)
                        {
                            arrowsRight[i].parentElement.parentElement.classList.add("expanded-wwc");
                            arrowsRight[i].click();
                            //console.log("simulated click on right arrow");
                            arrowsRight[i].classList.add("clicked");
                            arrowsLeft[i].click();
                            //console.log("simulated click on left arrow");
                            arrowsLeft[i].classList.add("clicked");
                        }
                    }
                }
            }, 250);
        }
    }

    function SwapSubsVidThumbnailsHQ()
    {
        clearInterval(waitForSubsThumbnails);
        if(lastCheckedURL.includes("/subscriptions") || lastCheckedURL.includes("/trending"))
        {
            waitForSubsThumbnails = setInterval(function(){
                let nails = document.querySelectorAll("img.yt-img-shadow[src*='hqdefault.jpg?']");
                //console.log("found " + nails.length + " LQ nails");
                for(let i = 0; i < nails.length; i++)
                    nails[i].src = nails[i].src.split("?")[0];
            }, 200);
        }
    }

    function URLChanged()
    {
        console.log("-urlchanged-");

        if(AutoExpandChannelVidContainers)
            AutoExpandContainers();

        if(HQTN)
            SwapSubsVidThumbnailsHQ();
    }
    function CleanCSSValue(val)
    {
        val = val.trim();

        //if only numbers...
        if(/^\d+$/.test(val))
            val += "px"; //...add px

        return val;
    }
    function CleanNumber(val)
    {
        val = parseFloat(val);

        return val;
    }

    function addGlobalStyle(css)
    {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    //=== SETTINGS HANDLE FUCTIONS ===//
    function SetFPPHandle() {
        GM_unregisterMenuCommand(FPPHandle);

        FPPHandle = GM_registerMenuCommand("Fade++ Compatibility mode (" + (FPPCompOn ? "On" : "Off") + ") -click to change-", function(){
            FPPCompOn = !FPPCompOn;
            GM_setValue("FPPCompOn", FPPCompOn);
            SetFPPHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetHomeVideoContainerWidthHandle() {
        GM_unregisterMenuCommand(HomeVideoContainerWidthHandle);

        HomeVideoContainerWidthHandle = GM_registerMenuCommand("[home-page] Video-renderer width (" + HomeVideoContainerWidth + ") -click to change-", function(){
            HomeVideoContainerWidth = CleanNumber(prompt("Set the width of a single video renderer on the page\nThe current value is: '" + HomeVideoContainerWidth + "'"));
            GM_setValue("HomeVideoContainerWidth", HomeVideoContainerWidth);
            SetHomeVideoContainerWidthHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetHQTNHandle() {
        GM_unregisterMenuCommand(HQTNHandle);

        HQTNHandle = GM_registerMenuCommand("[subs/trending] Load HQ thumbnails (" + (HQTN ? "On" : "Off") + ") -click to change-", function(){
            HQTN = !HQTN;
            GM_setValue("HQTN", HQTN);
            SetHQTNHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetSubVideoContainerWidthHandle() {
        GM_unregisterMenuCommand(SubVideoContainerWidthHandle);

        SubVideoContainerWidthHandle = GM_registerMenuCommand("[subs-page] Video-renderer width (" + SubVideoContainerWidth + ") -click to change-", function(){
            SubVideoContainerWidth = CleanNumber(prompt("Set the width of a single video renderer on the page\nThe current value is: '" + SubVideoContainerWidth + "'"));
            GM_setValue("SubVideoContainerWidth", SubVideoContainerWidth);
            SetSubVideoContainerWidthHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetTrendingVideoContainerWidthHandle() {
        GM_unregisterMenuCommand(TrendingVideoContainerWidthHandle);

        TrendingVideoContainerWidthHandle = GM_registerMenuCommand("[trending-page] Video-renderer width (" + TrendingVideoContainerWidth + ") -click to change-", function(){
            TrendingVideoContainerWidth = CleanNumber(prompt("Set the width of a single video renderer on the page\nThe current value is: '" + TrendingVideoContainerWidth + "'"));
            GM_setValue("TrendingVideoContainerWidth", TrendingVideoContainerWidth);
            SetTrendingVideoContainerWidthHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetTrendingVideoContainerHeightHandle() {
        GM_unregisterMenuCommand(TrendingVideoContainerHeightHandle);

        TrendingVideoContainerHeightHandle = GM_registerMenuCommand("[trending-page] Video-renderer height (" + TrendingVideoContainerHeight + ") -click to change-", function(){
            TrendingVideoContainerHeight = CleanNumber(prompt("Set the height of a single video renderer on the page\nThe current value is: '" + TrendingVideoContainerHeight + "'"));
            GM_setValue("TrendingVideoContainerHeight", TrendingVideoContainerHeight);
            SetTrendingVideoContainerHeightHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetSearchVideoContainerWidthHandle() {
        GM_unregisterMenuCommand(SearchVideoContainerWidthHandle);

        SearchVideoContainerWidthHandle = GM_registerMenuCommand("[search-results-page] Video-renderer width (" + SearchVideoContainerWidth + ") -click to change-", function(){
            SearchVideoContainerWidth = CleanNumber(prompt("Set the width of a single video renderer on the page\nThe current value is: '" + SearchVideoContainerWidth + "'"));
            GM_setValue("SearchVideoContainerWidth", SearchVideoContainerWidth);
            SetSearchVideoContainerWidthHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetSearchVideoContainerHeightHandle() {
        GM_unregisterMenuCommand(SearchVideoContainerHeightHandle);

        SearchVideoContainerHeightHandle = GM_registerMenuCommand("[search-results-page] Video-renderer height (" + SearchVideoContainerHeight + ") -click to change-", function(){
            SearchVideoContainerHeight = CleanNumber(prompt("Set the width of a single video renderer on the page\nThe current value is: '" + SearchVideoContainerHeight + "'"));
            GM_setValue("SearchVideoContainerHeight", SearchVideoContainerHeight);
            SetSearchVideoContainerHeightHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetShowChannelIconNextToVideosOnHomePageHandle() {
        GM_unregisterMenuCommand(ShowChannelIconNextToVideosOnHomePageHandle);

        ShowChannelIconNextToVideosOnHomePageHandle = GM_registerMenuCommand("[home-page] Show channel icons next to videos (" + (ShowChannelIconNextToVideosOnHomePage ? "Yes" : "No") + ") -click to change-", function(){
            ShowChannelIconNextToVideosOnHomePage = !ShowChannelIconNextToVideosOnHomePage;
            GM_setValue("ShowChannelIconNextToVideosOnHomePage", ShowChannelIconNextToVideosOnHomePage);
            SetShowChannelIconNextToVideosOnHomePageHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
	function SetAutoExpandChannelVidContainersHandle() {
        GM_unregisterMenuCommand(AutoExpandChannelVidContainersHandle);

        AutoExpandChannelVidContainersHandle = GM_registerMenuCommand("[channel-page] Auto-expand horizontal video lists (" + (AutoExpandChannelVidContainers ? "Yes" : "No") + ") -click to change-", function(){
            AutoExpandChannelVidContainers = !AutoExpandChannelVidContainers;
            GM_setValue("AutoExpandChannelVidContainers", AutoExpandChannelVidContainers);
            SetAutoExpandChannelVidContainersHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
    function SetHideSearchVideoBadgesHandle() {
        GM_unregisterMenuCommand(HideSearchVideoBadgesHandle);

        HideSearchVideoBadgesHandle = GM_registerMenuCommand("[search-results-page] Hide video badges (" + (HideSearchVideoBadges ? "Yes" : "No") + ") -click to change-", function(){
            HideSearchVideoBadges = !HideSearchVideoBadges;
            GM_setValue("HideSearchVideoBadges", HideSearchVideoBadges);
            SetHideSearchVideoBadgesHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
})();
