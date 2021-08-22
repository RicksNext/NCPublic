//Stuff for the Chart & the actual chart

const textBright = "#F0F0F3";
const lineColor = "#707073";
const socialColors = {
	twitter: "#3498db",
	youtube: `#FF0000`,
	twitch: `#6441a5`,
	tiktok: `#EE1D52`,
	triller: `#f7375d`,
	reddit: `#f35d06`,
	soundcloud: `#f35d06`,
	storyfire: `#f35d06`,
    discord: `#7289DA`,
    gab: `#30CE7D`,
    nasdaq: "#009fc2",
    utreon: "#0479cd",
    nextcounts: "#359add",
    mixerno: "#707073"
}
const maxUserPoints = 900;
const maxGapPoints = 1800;

Highcharts.setOptions({
    chart: {
        type: 'spline',
        zoomType: 'x',
        backgroundColor: 'transparent',
        plotBorderColor: 'transparent'
    },
    title: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 500,
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright
            }
        },
        lineColor: lineColor,
        minorGridLineColor: '#505053',
        tickColor: lineColor,
        title: {
            style: {
                color: textBright
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright
            }
        },
        lineColor: lineColor,
        minorGridLineColor: '#505053',
        tickColor: lineColor
    },
    credits: {
        enabled: true,
        text: "NextCounts",
        href: "https://nextcounts.com"
    },
});

var firstChart;
var secondChart;

var gapChart = new Highcharts.chart({
    chart: {
        renderTo: 'gapChart'
    },
    series: [{
        showInLegend: false,
        name: 'Gap',
        marker: { enabled: false },
        color: "#1DA1F2",
        lineColor: "#1DA1F2"
    }]
});


//time calc for generating charts

function calcTime() {
    var now = new Date();
    var time = now.getTime();
    var localOffset = -1 * now.getTimezoneOffset() * 60000;
    var newDate = new Date(time + localOffset).getTime();

    return newDate;
}


//URL Handler
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const user0InURL = urlParams.get('u1');
const user1InURL = urlParams.get('u2');
const platform0InUrl = urlParams.get('p1');
const platform1InUrl = urlParams.get('p2');

var user0 = '';
var platform0 = '';
var user1 = '';
var platform1 = '';

if (!user0InURL) {
    user0 = "ninja";
} else {
    user0 = user0InURL;
}
if (!user1InURL) {
    user1 = "ninja";
} else {
    user1 = user1InURL;
}
if (!platform0InUrl) {
    platform0 = "twitter";
} else {
    platform0 = platform0InUrl;
}
if (!platform1InUrl) {
    platform1 = "tiktok";
} else {
    platform1 = platform1InUrl;
}

//loading user essentials
const socialBadges = {
	verified: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
	lockedAcc: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
	twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitter"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path></svg>`,
	youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="5" width="18" height="14" rx="4"></rect><path d="M10 9l5 3l-5 3z"></path></svg>`,
	twitch: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitch"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z"></path><line x1="16" y1="8" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="12"></line></svg>`,
	tiktok: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5"></path></svg>`,
	soundcloud: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-soundcloud"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z"></path><line x1="9" y1="8" x2="9" y2="17"></line><line x1="6" y1="17" x2="6" y2="10"></line><line x1="3" y1="16" x2="3" y2="14"></line></svg>`,
	reddit: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-reddit"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z"></path><path d="M12 8l1-5 6 1"></path><circle cx="19" cy="4" r="1"></circle><circle cx="9" cy="13" r=".5" fill="currentColor"></circle><circle cx="15" cy="13" r=".5" fill="currentColor"></circle><path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5"></path></svg>`,
	discord: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path><path d="M7 16.5c3.5 1 6.5 1 10 0"></path><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5"></path><path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5"></path></svg>`,
    gab : `<i class="fas fa-frog"></i>`,
    nextcounts: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C11.4477 7 11 6.55228 11 6C11 5.44772 11.4477 5 12 5H17C17.5523 5 18 5.44772 18 6V11C18 11.5523 17.5523 12 17 12C16.4477 12 16 11.5523 16 11V8.41421L11.7071 12.7071C11.3166 13.0976 10.6834 13.0976 10.2929 12.7071L8 10.4142L3.70711 14.7071C3.31658 15.0976 2.68342 15.0976 2.29289 14.7071C1.90237 14.3166 1.90237 13.6834 2.29289 13.2929L7.29289 8.29289C7.68342 7.90237 8.31658 7.90237 8.70711 8.29289L11 10.5858L14.5858 7H12Z" fill="currentColor"></path></svg>`,
}

$('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">');

//"Customize counter" Modal code
var updateUserChart = true;
var updateGapChart = true;
var infiniteGapChart = false;

$("#applyChangesCustomize").click(function(){
    //user chart on/off switch
    if(disableUsersChart.checked) {
        firstChart.series[0].setData([]);
        secondChart.series[0].setData([]);
        document.getElementById("firstChart").style.display = "none";
        document.getElementById("secondChart").style.display = "none";
        updateUserChart = false;
    }

    if(!disableUsersChart.checked && updateUserChart == false){
        document.getElementById("firstChart").style.display = "block";
        document.getElementById("secondChart").style.display = "block";
        updateUserChart = true;
    }

    //gap chart on/off switch
    if(disableGapChart.checked) {
        gapChart.series[0].setData([]);
        document.getElementById("gapChartCard").style.display = "none";
        updateGapChart = false;
    }

    if(!disableGapChart.checked && updateGapChart == false){
        document.getElementById("gapChartCard").style.display = "block";
        updateGapChart = true;
    }

    //infinite gap chart on/off switch
    if(infiniteGap.checked) {
        infiniteGapChart = true;
    }

    if(!infiniteGap.checked && infiniteGapChart == true){
        infiniteGapChart = false;
    }
});

//abbreviate function
function abbrNum(number, decPlaces) {
    decPlaces = Math.pow(10,decPlaces);

    var abbrev = [ "k", "m", "b", "t" ];

    for (var i=abbrev.length-1; i>=0; i--) {
        var size = Math.pow(10,(i+1)*3);
        if(size <= number) {
             number = Math.round(number*decPlaces/size)/decPlaces;
             number += abbrev[i];
             break;
        }
    }

    return number;
}

//Search for user - "Basic" Edition (Noice edition got cancelled, oof)
var socialPlatform1 = '';
var socialPlatform2 = '';

document.getElementById("searchBar1").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchForUser1();
    }
});

$("#searchBtn1").click(function(){
	searchForUser1();
});

document.getElementById("searchBar2").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchForUser2();
    }
});

$("#searchBtn2").click(function(){
	searchForUser2();
});

$("#compareBtn").click(function(){
	if(document.getElementById('searchUsername1').title !== "" && document.getElementById('searchUsername2').title !== "") {
		location.href = `/compare/?p1=${socialPlatform1}&p2=${socialPlatform2}&u1=${document.getElementById('searchUsername1').title}&u2=${document.getElementById('searchUsername2').title}`;
	}
});

//searches for the 1st user
function searchForUser1() {
    var searchTerm = searchBar1.value.replace("@", "");
    var username = "";

    var selectedPlatform = document.getElementById('platformSelector1').value;
	var searchUsername = searchUsername1;
	var searchBottomText = searchBottomtext1;

    if(selectedPlatform == "twitter") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("twitter.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitter.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/twitter/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.verified == true) {
                      if(data.protectedAcc == true) {
                          searchUsername.innerHTML = `${data.username} ${socialBadges.verified} ${socialBadges.lockedAcc}`;
                      }
                      searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
                      if(data.protectedAcc == true) {
                          searchUsername.innerHTML = `${data.username} ${socialBadges.lockedAcc}`;
                      } else {
                          searchUsername.innerHTML = data.username;
                      }
                  }
                  searchPfp1.src = data.pfp.large;
                  searchBottomText.innerHTML = `${(data.followers).toLocaleString()} Followers`;
                  searchUsername.title = username;
                  socialPlatform1 = 'twitter';
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
    }

	if(selectedPlatform == "tiktok") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("tiktok.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitter.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/tiktok/search/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.verified == true) {
                    searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
					searchUsername.innerHTML = data.username;
                  }
                  searchPfp1.src = data.avatar;
                  searchBottomText.innerHTML = `${(data.followers).toLocaleString()} Followers`;
                  searchUsername.title = data.userIdentifier;
                  socialPlatform1 = 'tiktok';
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "discord") {
        if (searchTerm.includes("https://") || searchTerm.includes("http://")) {
            var aaa = searchTerm.split("/");
            if(searchTerm.includes("/invite/")) {
                console.log(aaa[4]);
                username = aaa[4];
            } else {
                console.log(aaa[3]);
                username = aaa[3];
            }
        } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
            var aaa = searchTerm.split("/");
            if(searchTerm.includes("/invite/")) {
                console.log(aaa[2]);
                username = aaa[2];
            } else if (searchTerm.includes("discord.gg")){
                console.log(aaa[1]);
                username = aaa[1];
            } else {
                console.log(searchTerm);
                username = searchTerm;
            }
        }

        $.ajax({
            url: `https://api.nextcounts.com/api/discord/server/${username}`,
            type: "GET",
            dataType: "JSON",
            success: function(data){
                if(data.error) {
                    searchUsername.innerHTML = "Server not found.";
                    searchBottomText.innerHTML = "Please check if the serverID is correct and try again.";
                } else {
                    searchUsername.innerHTML = data.guild.serverName;
                    searchPfp1.src = data.guild.serverImg;
                    searchBottomText.innerHTML = `${data.membersCount.toLocaleString()} Members`;
                    searchUsername.title = username;
                    socialPlatform1 = 'discord';
                }
            },
            error: function(){
                searchUsername.innerHTML = "Something went wrong on our end.";
                searchBottomText.innerHTML = "Please try again later or in a few minutes.";
            }
        });
	}

	if(selectedPlatform == "twitch-followers") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/twitch/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.partner == true) {
                    searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
					searchUsername.innerHTML = data.username;
                  }
                  searchPfp1.src = data.pfp;
                  searchBottomText.innerHTML = `${(data.followers).toLocaleString()} Followers`;
                  searchUsername.title = username;
                  socialPlatform1 = 'twitch-followers';
              }
          },
          error: function(){
              searchUsername1.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}
	
	if(selectedPlatform == "twitch-views") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/twitch/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.partner == true) {
                    searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
					searchUsername.innerHTML = data.username;
                  }
                  searchPfp1.src = data.pfp;
                  searchBottomText.innerHTML = `${(data.views).toLocaleString()} Channel Views`;
                  searchUsername.title = username;
                  socialPlatform1 = 'twitch-views';
              }
          },
          error: function(){
              searchUsername1.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "ytsubcount-mixerno") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/mixerno/${search.cid}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
                            searchUsername.innerHTML = "The channel isn't estimated by Mixerno.";
                            searchBottomText.innerHTML = "There's nothing we can do really.";
                        } else {
                          searchUsername.innerHTML = data.name;
                            searchPfp1.src = data.image;
                            searchBottomText.innerHTML = `${(data.estimatedSubCount).toLocaleString()} Subscribers`;
                            searchUsername.title = data.cid;
                            socialPlatform1 = 'ytsubcount-mixerno';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on Mixerno's end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
                    }
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}
	
	if(selectedPlatform == "ytsubcount-nca") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://estimates.nextcounts.com/est/youtube/${search.cid}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
                            searchUsername.innerHTML = "The channel isn't estimated by NextCounts.";
                            searchBottomText.innerHTML = "If the channel has more than 100k subs, then try again.";
                        } else {
                          searchUsername.innerHTML = data.channelName;
                            searchPfp1.src = data.channelImage;
                            searchBottomText.innerHTML = `${(data.estimatedCount).toLocaleString()} Subscribers`;
                            searchUsername.title = search.cid;
                            socialPlatform1 = 'ytsubcount-nca';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on our end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
                    }
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "ytsubcount-lcio") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/livecountsio/${search.cid}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
                            searchUsername.innerHTML = "The channel isn't estimated by LC.io.";
                            searchBottomText.innerHTML = "There's nothing we can do.";
                        } else {
							searchUsername.innerHTML = search.displayName;
							  searchPfp1.src = search.pfp;
							  searchBottomText.innerHTML = `${(data.estimatedSubCount).toLocaleString()} Subscribers`;
							  searchUsername.title = search.cid;
							  socialPlatform1 = 'ytsubcount-lcio';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on our end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
					}
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
    }
    
	if(selectedPlatform == "ytsubcount-t1ch") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://api.livecounts.me/est/youtube/${search.cid}/1456907299/6681084873`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(!data.cname) {
                            searchUsername.innerHTML = "The channel isn't estimated by t1ch.";
                            searchBottomText.innerHTML = "We know t1ch very well. Could you try again?";
                        } else {
                          searchUsername.innerHTML = data.cname;
                            searchPfp1.src = data.cimage;
                            searchBottomText.innerHTML = `${(data.subscriberCount).toLocaleString()} Subscribers`;
                            searchUsername.title = data.cid;
                            socialPlatform1 = 'ytsubcount-t1ch';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on t1ch's end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
                    }
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "ytsubcount") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                searchUsername.innerHTML = data.displayName;
                  searchPfp1.src = data.pfp;
                  searchBottomText.innerHTML = `${abbrNum(data.subcount, 3)} Subscribers`;
                  searchUsername.title = data.cid;
                  socialPlatform1 = 'ytsubcount';
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}
}

//searches for the 2nd user
function searchForUser2() {
    var searchTerm = searchBar2.value.replace("@", "");
    var username = "";

    var selectedPlatform = document.getElementById('platformSelector2').value;
	var searchUsername = searchUsername2;
	var searchBottomText = searchBottomtext2;

    if(selectedPlatform == "twitter") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("twitter.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitter.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/twitter/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.verified == true) {
                      if(data.protectedAcc == true) {
                          searchUsername.innerHTML = `${data.username} ${socialBadges.verified} ${socialBadges.lockedAcc}`;
                      }
                      searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
                      if(data.protectedAcc == true) {
                          searchUsername.innerHTML = `${data.username} ${socialBadges.lockedAcc}`;
                      } else {
                          searchUsername.innerHTML = data.username;
                      }
                  }
                  searchPfp2.src = data.pfp.large;
                  searchBottomText.innerHTML = `${(data.followers).toLocaleString()} Followers`;
                  searchUsername.title = username;
                  socialPlatform2 = 'twitter';
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
    }

	if(selectedPlatform == "tiktok") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("tiktok.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitter.com")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/tiktok/search/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.verified == true) {
                    searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
					searchUsername.innerHTML = data.username;
                  }
                  searchPfp2.src = data.avatar;
                  searchBottomText.innerHTML = `${(data.followers).toLocaleString()} Followers`;
                  searchUsername.title = data.userIdentifier;
                  socialPlatform2 = 'tiktok';
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "twitch-followers") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/twitch/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.partner == true) {
                    searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
					searchUsername.innerHTML = data.username;
                  }
                  searchPfp2.src = data.pfp;
                  searchBottomText.innerHTML = `${(data.followers).toLocaleString()} Followers`;
                  searchUsername.title = username;
                  socialPlatform2 = 'twitch-followers';
              }
          },
          error: function(){
              searchUsername1.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
    }
	
	if(selectedPlatform == "twitch-views") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[3];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("twitch.tv")) {
              var aaa = searchTerm.split("/");
              username = aaa[1];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/twitch/user/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "User not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                  if(data.partner == true) {
                    searchUsername.innerHTML = `${data.username} ${socialBadges.verified}`;
                  } else {
					searchUsername.innerHTML = data.username;
                  }
                  searchPfp2.src = data.pfp;
                  searchBottomText.innerHTML = `${(data.views).toLocaleString()} Channel Views`;
                  searchUsername.title = username;
                  socialPlatform2 = 'twitch-views';
              }
          },
          error: function(){
              searchUsername1.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
    }
    
	if(selectedPlatform == "discord") {
        if (searchTerm.includes("https://") || searchTerm.includes("http://")) {
            var aaa = searchTerm.split("/");
            if(searchTerm.includes("/invite/")) {
                console.log(aaa[4]);
                username = aaa[4];
            } else {
                console.log(aaa[3]);
                username = aaa[3];
            }
        } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
            var aaa = searchTerm.split("/");
            if(searchTerm.includes("/invite/")) {
                console.log(aaa[2]);
                username = aaa[2];
            } else if (searchTerm.includes("discord.gg")){
                console.log(aaa[1]);
                username = aaa[1];
            } else {
                console.log(searchTerm);
                username = searchTerm;
            }
        }

        $.ajax({
            url: `https://api.nextcounts.com/api/discord/server/${username}`,
            type: "GET",
            dataType: "JSON",
            success: function(data){
                if(data.error) {
                    searchUsername.innerHTML = "Server not found.";
                    searchBottomText.innerHTML = "Please check if the serverID is correct and try again.";
                } else {
                    searchUsername.innerHTML = data.guild.serverName;
                    searchPfp2.src = data.guild.serverImg;
                    searchBottomText.innerHTML = `${data.membersCount.toLocaleString()} Members`;
                    searchUsername.title = username;
                    socialPlatform2 = 'discord';
                }
            },
            error: function(){
                searchUsername.innerHTML = "Something went wrong on our end.";
                searchBottomText.innerHTML = "Please try again later or in a few minutes.";
            }
        });
	}

	if(selectedPlatform == "ytsubcount-nca") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://estimates.nextcounts.com/est/youtube/${search.cid}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
                            searchUsername.innerHTML = "The channel isn't estimated by NextCounts.";
                            searchBottomText.innerHTML = "If the channel has more than 100k subs, then try again.";
                        } else {
                          searchUsername.innerHTML = data.channelName;
                            searchPfp2.src = data.channelImage;
                            searchBottomText.innerHTML = `${(data.estimatedCount).toLocaleString()} Subscribers`;
                            searchUsername.title = search.cid;
                            socialPlatform2 = 'ytsubcount-nca';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on our end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
                    }
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}
	
	if(selectedPlatform == "ytsubcount-mixerno") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/mixerno/${search.cid}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
                            searchUsername.innerHTML = "The channel isn't estimated by Mixerno.";
                            searchBottomText.innerHTML = "There's nothing we can do really.";
                        } else {
                          searchUsername.innerHTML = data.name;
                            searchPfp2.src = data.image;
                            searchBottomText.innerHTML = `${(data.estimatedSubCount).toLocaleString()} Subscribers`;
                            searchUsername.title = data.cid;
                            socialPlatform2 = 'ytsubcount-mixerno';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on Mixerno's end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
                    }
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}
	
	if(selectedPlatform == "ytsubcount-lcio") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/livecountsio/${search.cid}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
                            searchUsername.innerHTML = "The channel isn't estimated by LC.io.";
                            searchBottomText.innerHTML = "There's nothing we can do.";
                        } else {
							searchUsername.innerHTML = search.displayName;
							  searchPfp2.src = search.pfp;
							  searchBottomText.innerHTML = `${(data.estimatedSubCount).toLocaleString()} Subscribers`;
							  searchUsername.title = search.cid;
							  socialPlatform2 = 'ytsubcount-lcio';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on our end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
					}
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "ytsubcount-t1ch") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(search){
              if(search.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                $.ajax({
                    url: `https://api.livecounts.me/est/youtube/${search.cid}/1456907299/6681084873`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(!data.cname) {
                            searchUsername.innerHTML = "The channel isn't estimated by t1ch.";
                            searchBottomText.innerHTML = "We know t1ch very well. Could you try again?";
                        } else {
                          searchUsername.innerHTML = data.cname;
                            searchPfp2.src = data.cimage;
                            searchBottomText.innerHTML = `${(data.subscriberCount).toLocaleString()} Subscribers`;
                            searchUsername.title = data.cid;
                            socialPlatform2 = 'ytsubcount-t1ch';
                        }
                    },
                    error: function(){
                        searchUsername.innerHTML = "Something went wrong on t1ch's end.";
                        searchBottomText.innerHTML = "Please try again later or in a few minutes.";
                    }
                });
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}

	if(selectedPlatform == "ytsubcount") {
      if(searchTerm.includes("https://") || searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[4];
          }
      } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
          if(searchTerm.includes("youtube.com/channel/")) {
              var aaa = searchTerm.split("/");
              username = aaa[2];
          } else {
              username = searchTerm;
          }
      }

      $.ajax({
          url: `https://api.nextcounts.com/api/youtube/channel/search/${username}`,
          type: "GET",
          dataType: "JSON",
          success: function(data){
              if(data.error) {
                  searchUsername.innerHTML = "Channel not found.";
                  searchBottomText.innerHTML = "Please check if the spelling is correct and try again.";
              } else {
                searchUsername.innerHTML = data.displayName;
                  searchPfp2.src = data.pfp;
                  searchBottomText.innerHTML = `${abbrNum(data.subcount, 3)} Subscribers`;
                  searchUsername.title = data.cid;
                  socialPlatform2 = 'ytsubcount';
              }
          },
          error: function(){
              searchUsername.innerHTML = "Something went wrong on our end.";
              searchBottomText.innerHTML = "Please try again later or in a few minutes.";
          }
      });
	}
}

//Loads the actual data letsgooo
var count0;
var count1;


function loadDataFirstTime() {
    var countUp = new CountUp('gapOdo', 0);

    function firstUserLoad() {
        if(platform0 === 'twitter') {
            document.getElementById('bottomtext-user0').innerHTML = "Followers";
            firstChart = new Highcharts.chart({
                chart: {
                    renderTo: 'firstChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Followers',
                    marker: { enabled: false },
                    color: socialColors.twitter,
                    lineColor: socialColors.twitter
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/twitter/user/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            if(data.verified == true) {
                                if(data.protectedAcc == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.lockedAcc} ${socialBadges.twitter}`, 0);
                                }
                                updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.twitter}`, 0);
                            } else {
                                if(data.protectedAcc == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.lockedAcc} ${socialBadges.twitter}`, 0);
                                } else {
                                    updateCounts.name(`${data.username} ${socialBadges.twitter}`, 0);
                                }
                            }
                            updateCounts.pfp(data.pfp.large, 0);
                            updateCounts.mainCount(data.followers, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform0 === 'twitch-followers'){
            document.getElementById('bottomtext-user0').innerHTML = "Followers";
            firstChart = new Highcharts.chart({
                chart: {
                    renderTo: 'firstChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Followers',
                    marker: { enabled: false },
                    color: socialColors.twitch,
                    lineColor: socialColors.twitch
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/twitch/user/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            if(data.partner == true) {
                                updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.twitch}`, 0);
                            } else {
                                updateCounts.name(`${data.username} ${socialBadges.twitch}`, 0);
                            }
                            updateCounts.pfp(data.pfp, 0);
                            updateCounts.mainCount(data.followers, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }
		
        if(platform0 === 'twitch-views'){
            document.getElementById('bottomtext-user0').innerHTML = "Views";
            firstChart = new Highcharts.chart({
                chart: {
                    renderTo: 'firstChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Channel Views',
                    marker: { enabled: false },
                    color: socialColors.twitch,
                    lineColor: socialColors.twitch
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/twitch/user/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            if(data.partner == true) {
                                updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.twitch}`, 0);
                            } else {
                                updateCounts.name(`${data.username} ${socialBadges.twitch}`, 0);
                            }
                            updateCounts.pfp(data.pfp, 0);
                            updateCounts.mainCount(data.views, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform0 === 'tiktok'){
        firstChart = new Highcharts.chart({
            chart: {
                renderTo: 'firstChart'
            },
            series: [{
                showInLegend: false,
                name: 'Followers',
                marker: { enabled: false },
                color: socialColors.tiktok,
                lineColor: socialColors.tiktok
            }]
        });
            document.getElementById('bottomtext-user0').innerHTML = "Followers";

            $.ajax({
                url: `https://api.nextcounts.com/api/tiktok/user/${user0}`,
                type: "GET",
                dataType: "JSON",
                success: function(data){
                    if(data.error) {
                        return;
                    } else {
                        updateCounts.name(`${data.username} ${socialBadges.tiktok}`, 0);
                        updateCounts.pfp(data.userImg, 0);
                    }
                },
                error: function(){}
            });

            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/tiktok/user/stats/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            updateCounts.mainCount(data.followers, 0, platform0);
                        }
                    },
                    error: function(){}
                });
            }, 2000);
        }

        if(platform0 === 'discord'){
        firstChart = new Highcharts.chart({
            chart: {
                renderTo: 'firstChart'
            },
            series: [{
                showInLegend: false,
                name: 'Members',
                marker: { enabled: false },
                color: socialColors.discord,
                lineColor: socialColors.discord
            }]
        });
            document.getElementById('bottomtext-user0').innerHTML = "Members";
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/discord/server/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            updateCounts.name(`${data.guild.serverName} ${socialBadges.discord}`, 0);
                            updateCounts.pfp(data.guild.serverImg, 0);
                            updateCounts.mainCount(data.membersCount, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform0 === 'ytsubcount-nca'){
        firstChart = new Highcharts.chart({
            chart: {
                renderTo: 'firstChart'
            },
            series: [{
                showInLegend: false,
                name: 'Subscribers',
                marker: { enabled: false },
                color: socialColors.youtube,
                lineColor: socialColors.youtube
            }]
        });
            document.getElementById('bottomtext-user0').innerHTML = "Subscribers";
            setInterval(function() {
                $.ajax({
                    url: `https://estimates.nextcounts.com/est/youtube/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            updateCounts.name(`${data.channelName} ${socialBadges.youtube}`, 0);
                            updateCounts.pfp(data.channelImage, 0);
                            updateCounts.mainCount(data.estimatedCount, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }
		
        if(platform0 === 'ytsubcount-mixerno'){
        firstChart = new Highcharts.chart({
            chart: {
                renderTo: 'firstChart'
            },
            series: [{
                showInLegend: false,
                name: 'Subscribers',
                marker: { enabled: false },
                color: socialColors.youtube,
                lineColor: socialColors.youtube
            }]
        });
            document.getElementById('bottomtext-user0').innerHTML = "Subscribers";
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/mixerno/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.name(`${data.channelName} ${socialBadges.youtube}`, 0);
                            updateCounts.pfp(data.avatar, 0);
                            updateCounts.mainCount(data.estimatedSubCount, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform0 === 'ytsubcount-lcio'){
            document.getElementById('bottomtext-user0').innerHTML = "Subscribers";
            firstChart = new Highcharts.chart({
                chart: {
                    renderTo: 'firstChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Subscribers',
                    marker: { enabled: false },
                    color: socialColors.youtube,
                    lineColor: socialColors.youtube
                }]
            });

            $.ajax({
                url: `https://api.nextcounts.com/api/youtube/channel/${user0}`,
                type: "GET",
                dataType: "JSON",
                success: function(data){
                    if(data.msg) {
                        return;
                    } else {
                        updateCounts.name(`${data.username} ${socialBadges.youtube}`, 0);
                        updateCounts.pfp(data.userImg, 0);
                    }
                },
                error: function(){}
            });

            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/livecountsio/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.mainCount(data.estimatedSubCount, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform0 === 'ytsubcount-t1ch'){
        firstChart = new Highcharts.chart({
            chart: {
                renderTo: 'firstChart'
            },
            series: [{
                showInLegend: false,
                name: 'Subscribers',
                marker: { enabled: false },
                color: socialColors.youtube,
                lineColor: socialColors.youtube
            }]
        });
            document.getElementById('bottomtext-user0').innerHTML = "Subscribers";
            setInterval(function() {
                $.ajax({
                    url: `https://api.livecounts.me/est/youtube/${user0}/1456907299/6681084873`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.name(`${data.cname} ${socialBadges.youtube}`, 0);
                            updateCounts.pfp(data.cimage, 0);
                            updateCounts.mainCount(data.subscriberCount, 0, platform0);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform0 === 'ytsubcount'){
        firstChart = new Highcharts.chart({
            chart: {
                renderTo: 'firstChart'
            },
            series: [{
                showInLegend: false,
                name: 'Subscribers',
                marker: { enabled: false },
                color: socialColors.youtube,
                lineColor: socialColors.youtube
            }]
        });
            document.getElementById('bottomtext-user0').innerHTML = "Subscribers";
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/${user0}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            updateCounts.name(`${data.username} ${socialBadges.youtube}`, 0);
                            updateCounts.pfp(data.userImg, 0);
                            updateCounts.mainCount(data.subcount, 0, platform0);
                        }
                    },
                    error: function(){}
                });
            }, 2000);
        }
    }
    function secondUserLoad() {
        if(platform1 === 'twitter') {
            document.getElementById('bottomtext-user1').innerHTML = "Followers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Followers',
                    marker: { enabled: false },
                    color: socialColors.twitter,
                    lineColor: socialColors.twitter
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/twitter/user/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            if(data.verified == true) {
                                if(data.protectedAcc == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.lockedAcc} ${socialBadges.twitter}`, 1);
                                }
                                updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.twitter}`, 1);
                            } else {
                                if(data.protectedAcc == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.lockedAcc} ${socialBadges.twitter}`, 1);
                                } else {
                                    updateCounts.name(`${data.username} ${socialBadges.twitter}`, 1);
                                }
                            }
                            updateCounts.pfp(data.pfp.large, 1);
                            updateCounts.mainCount(data.followers, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform1 === 'twitch-followers'){
            document.getElementById('bottomtext-user1').innerHTML = "Followers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Followers',
                    marker: { enabled: false },
                    color: socialColors.twitch,
                    lineColor: socialColors.twitch
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/twitch/user/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            if(data.partner == true) {
                                updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.twitch}`, 1);
                            } else {
                                updateCounts.name(`${data.username} ${socialBadges.twitch}`, 1);
                            }
                            updateCounts.pfp(data.pfp, 1);
                            updateCounts.mainCount(data.followers, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }
		
        if(platform1 === 'twitch-views'){
            document.getElementById('bottomtext-user1').innerHTML = "Views";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Channel Views',
                    marker: { enabled: false },
                    color: socialColors.twitch,
                    lineColor: socialColors.twitch
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/twitch/user/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            if(data.partner == true) {
                                updateCounts.name(`${data.username} ${socialBadges.verified} ${socialBadges.twitch}`, 1);
                            } else {
                                updateCounts.name(`${data.username} ${socialBadges.twitch}`, 1);
                            }
                            updateCounts.pfp(data.pfp, 1);
                            updateCounts.mainCount(data.views, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform1 === 'tiktok'){
            document.getElementById('bottomtext-user1').innerHTML = "Followers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Followers',
                    marker: { enabled: false },
                    color: socialColors.tiktok,
                    lineColor: socialColors.tiktok
                }]
            });

            $.ajax({
                url: `https://api.nextcounts.com/api/tiktok/user/${user1}`,
                type: "GET",
                dataType: "JSON",
                success: function(data){
                    if(data.error) {
                        return;
                    } else {
                        updateCounts.name(`${data.username} ${socialBadges.tiktok}`, 1);
                        updateCounts.pfp(data.avatar, 1);
                    }
                },
                error: function(){}
            });

            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/tiktok/user/stats/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            updateCounts.mainCount(data.followers, 1, platform1);
                        }
                    },
                    error: function(){}
                });
            }, 2000);
        }

        if(platform1 === 'discord'){
            document.getElementById('bottomtext-user1').innerHTML = "Members";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Members',
                    marker: { enabled: false },
                    color: socialColors.discord,
                    lineColor: socialColors.discord
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/discord/server/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.error) {
							return;
                        } else {
                            updateCounts.name(`${data.guild.serverName} ${socialBadges.discord}`, 1);
                            updateCounts.pfp(data.guild.serverImg, 1);
                            updateCounts.mainCount(data.membersCount, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform1 === 'ytsubcount-nca'){
            document.getElementById('bottomtext-user1').innerHTML = "Subscribers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Subscribers',
                    marker: { enabled: false },
                    color: socialColors.youtube,
                    lineColor: socialColors.youtube
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://estimates.nextcounts.com/est/youtube/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.name(`${data.channelName} ${socialBadges.youtube}`, 1);
                            updateCounts.pfp(data.channelImage, 1);
                            updateCounts.mainCount(data.estimatedCount, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }
		
        if(platform1 === 'ytsubcount-mixerno'){
            document.getElementById('bottomtext-user1').innerHTML = "Subscribers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Subscribers',
                    marker: { enabled: false },
                    color: socialColors.youtube,
                    lineColor: socialColors.youtube
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/mixerno/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.name(`${data.channelName} ${socialBadges.youtube}`, 1);
                            updateCounts.pfp(data.avatar, 1);
                            updateCounts.mainCount(data.estimatedSubCount, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform1 === 'ytsubcount-lcio'){
            document.getElementById('bottomtext-user1').innerHTML = "Subscribers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Subscribers',
                    marker: { enabled: false },
                    color: socialColors.youtube,
                    lineColor: socialColors.youtube
                }]
            });

            $.ajax({
                url: `https://api.nextcounts.com/api/youtube/channel/${user1}`,
                type: "GET",
                dataType: "JSON",
                success: function(data){
                    if(data.msg) {
                        return;
                    } else {
                        updateCounts.name(`${data.username} ${socialBadges.youtube}`, 1);
                        updateCounts.pfp(data.userImg, 1);
                    }
                },
                error: function(){}
            });

            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/estimate/livecountsio/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.mainCount(data.estimatedSubCount, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform1 === 'ytsubcount-t1ch'){
            document.getElementById('bottomtext-user1').innerHTML = "Subscribers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Subscribers',
                    marker: { enabled: false },
                    color: socialColors.youtube,
                    lineColor: socialColors.youtube
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.livecounts.me/est/youtube/${user1}/1456907299/6681084873`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.name(`${data.cname} ${socialBadges.youtube}`, 1);
                            updateCounts.pfp(data.cimage, 1);
                            updateCounts.mainCount(data.subscriberCount, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }

        if(platform1 === 'ytsubcount'){
            document.getElementById('bottomtext-user1').innerHTML = "Subscribers";
            secondChart = new Highcharts.chart({
                chart: {
                    renderTo: 'secondChart'
                },
                series: [{
                    showInLegend: false,
                    name: 'Subscribers',
                    marker: { enabled: false },
                    color: socialColors.youtube,
                    lineColor: socialColors.youtube
                }]
            });
            setInterval(function() {
                $.ajax({
                    url: `https://api.nextcounts.com/api/youtube/channel/${user1}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function(data){
                        if(data.msg) {
							return;
                        } else {
                            updateCounts.name(`${data.username} ${socialBadges.youtube}`, 1);
                            updateCounts.pfp(data.userImg, 1);
                            updateCounts.mainCount(data.subcount, 1, platform1);
                        }
                    },
                    error: function(){}
                })
            }, 2000);
        }
    }

    setInterval(function() {
        if(isNaN(count0) === false && isNaN(count1) === false) {
            var gap = Math.floor(count0 - count1);
			var prevGap = 0;

            if (!countUp.error) {
              countUp.start();
            } else {
              console.error(countUp.error);
            }
			
			if(prevGap !== gap) {
				prevGap = gap;
				countUp.update(gap);
			}
            
            //document.getElementById('gapOdo').innerHTML = gap;
            if(updateGapChart == true) {
                if(infiniteGapChart == false) {
                    if (gapChart.series[0].points.length >= maxGapPoints) {
                        gapChart.series[0].data[0].remove();
                    }
                }
                gapChart.series[0].addPoint([calcTime(), gap]);
            }
        }
    }, 2000);

	firstUserLoad();
	secondUserLoad();
}

loadDataFirstTime();

//updates the content in the page
var updateCounts = {
    name: function(name, number) {
        if(number == 0) {
            document.getElementById('username0').innerHTML = name;
        } else if(number == 1) {
            document.getElementById('username1').innerHTML = name;
        }
    },
    pfp: function(url, number) {
        if(number == 0) {
            document.getElementById('pfp-user0').src = url;
        } else if(number == 1) {
            document.getElementById('pfp-user1').src = url;
        }
    },
    mainCount: function(count, number, platform) {
        if(number == 0){
            if(platform == "twitter" || platform == "tiktok" || platform == "ytsubcount-nca") {
                if(count >= 1) {
                    document.getElementById('odo-user0').innerHTML = count;
                    count0 = count;

                    if(updateUserChart == true) {
                        if (firstChart.series[0].points.length >= maxUserPoints) {
                            firstChart.series[0].data[0].remove();
                        }
                        firstChart.series[0].addPoint([calcTime(), count]);
                    }
                }
            } else {
                document.getElementById('odo-user0').innerHTML = count;
                count0 = count;

                if(updateUserChart == true) {
                    if (firstChart.series[0].points.length >= maxUserPoints) {
                        firstChart.series[0].data[0].remove();
                    }
                    firstChart.series[0].addPoint([calcTime(), count]);
                }
            }
        } else if(number == 1) {
            if(platform == "twitter" || platform == "tiktok" || platform == "ytsubcount-nca") {
                if(count >= 1) {
                    document.getElementById('odo-user1').innerHTML = count;
                    count1 = count;

                    if(updateUserChart == true) {
                        if (secondChart.series[0].points.length >= maxUserPoints) {
                            secondChart.series[0].data[0].remove();
                        }
                        secondChart.series[0].addPoint([calcTime(), count]);
                    }
                }
            } else {
                document.getElementById('odo-user1').innerHTML = count;
                count1 = count;

                if(updateUserChart == true) {
                    if (secondChart.series[0].points.length >= maxUserPoints) {
                        secondChart.series[0].data[0].remove();
                    }
                    secondChart.series[0].addPoint([calcTime(), count]);
                }
            }
        }
    }
}
