//Stuff for the Chart & the actual chart

const textBright = "#F0F0F3";
const lineColor = "#707073";
const socialColor = "#ff0000";
const maxPoints = 900;

const chart = new Highcharts.chart({
  chart: {
      renderTo: 'chart',
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

  series: [{
    showInLegend: false,
     name: 'Subscribers',
    marker: { enabled: false },
    color: socialColor,
    lineColor: socialColor
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

const userInURL = urlParams.get('u');
const providerInURL = Number(urlParams.get('p'));
const odometerInURL = urlParams.get('o');

var selectedProvider = 0;

if (!userInURL) {
    user = "UCL-t6GiYdYgOgDdFVVx5G0w";
} else {
    user = userInURL;
}


if(!odometerInURL || odometerInURL == 0 || odometerInURL == "normal") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">');
}
if (odometerInURL == "1" || odometerInURL == "fast") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast.css">');
}
if (odometerInURL == "2" || odometerInURL == "ncolored") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-colored.css">');
}
if (odometerInURL == "3" || odometerInURL == "fcolored") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast-colored.css">');
}

//"Customize counter" Modal code
var updateChart = true;
var bannerCurrent = 1;
var hasBanner = true;

$("#applyChangesCustomize").click(function(){
    //Odometer customizer
    if(odometerSelector.value == 'fast') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast.css">');
    } else if (odometerSelector.value == 'ncolored') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-colored.css">');
    } else if (odometerSelector.value == 'fcolored') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast-colored.css">');
    } else if (odometerSelector.value == 'normal') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">');
    }

    //chart on/off switch
    if(disableChart.checked) {
        chart.series[0].setData([]);
        updateChart = false;
        document.getElementById("chart").style.display = "none";
    }

    if(!disableChart.checked && updateChart == false){
        document.getElementById("chart").style.display = "block";
        updateChart = true;
    }
	
	//i am so depressed right now, you have no idea
	if(countsSelector.value !== currentProvider) {
		chart.series[0].setData([]);
		currentProvider = countsSelector.value;
	}
});

//Search for user - "Basic" Edition (Noice edition got cancelled, oof)
document.getElementById("searchBar").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchForUser();
    }
});

$("#searchBtn").click(function(){
	searchForUser();
});

$("#searchUserBox").click(function(){
	location.href = `/youtube/subscribers/?u=${document.getElementById('searchUsername').title}&p=${searchProvider}`;
});

$("#subscribeBtn").click(function(){
	parent.open('https://youtube.com/channel/' + user);
});

var searchProvider = 0;
var currentProvider = 0;

function searchForUser() {
    var searchTerm = searchBar.value;
    var username = "";
	var currentSelectedProvider = providerSearch.value;

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
			success: function(dataa){
				if(dataa.error) {
					searchUsername.innerHTML = "Channel not found.";
					searchBottomtext.innerHTML = "Please check if the spelling is correct and try again.";
				} else {
					if(currentSelectedProvider == 0) {
						$.ajax({
							url: `https://api.nextcounts.com/api/youtube/channel/${dataa.cid}`,
							type: "GET",
							dataType: "JSON",
							success: function(data){
								if(data.error) {
									searchUsername.innerHTML = "Channel not found.";
									searchBottomtext.innerHTML = "Please check if the spelling is correct and try again.";
								} else {
									searchUsername.innerHTML = data.username;
									searchPfp.src = data.userImg;
									searchBottomtext.innerHTML = `${(data.subcount).toLocaleString()} Subscribers`;
									searchUsername.title = dataa.cid;
									searchProvider = 0;
									searchUserBox.style.cursor = `pointer`;
								}
							},
							error: function(){
								searchUsername.innerHTML = "Our API seems to be down right now.";
								searchBottomtext.innerHTML = "Please try again later.";
							}
						});
					}
					
					if(currentSelectedProvider == 1) {
						$.ajax({
							url: `https://api.mixerno.space/youtube/estimated/user/${dataa.cid}`,
							type: "GET",
							dataType: "JSON",
							success: function(data){
								if(data.msg) {
									searchUsername.innerHTML = "Channel isn't estimated by Mixerno.";
									searchBottomtext.innerHTML = "There's nothing we can do.";
								} else {
									searchUsername.innerHTML = data.name;
									searchPfp.src = data.image;
									searchBottomtext.innerHTML = `${(data.SubscriberCount).toLocaleString()} Subscribers`;
									searchUsername.title = dataa.cid;
									searchProvider = 1;
									searchUserBox.style.cursor = `pointer`;
								}
							},
							error: function(){
								searchUsername.innerHTML = "Mixerno's API seems to be down right now.";
								searchBottomtext.innerHTML = "Please try again later.";
							}
						});
					}
					
					if(currentSelectedProvider == 2) {
						$.ajax({
							url: `https://api.livecounts.me/est/youtube/${dataa.cid}/1456907299/6681084873`,
							type: "GET",
							dataType: "JSON",
							success: function(data){
								if(!data.cname) {
									searchUsername.innerHTML = "Channel isn't estimated by T1ch.";
									searchBottomtext.innerHTML = "There's nothing we can do.";
								} else {
									searchUsername.innerHTML = data.cname;
									searchPfp.src = data.cimage;
									searchBottomtext.innerHTML = `${(data.subscriberCount).toLocaleString()} Subscribers`;
									searchUsername.title = dataa.cid;
									searchProvider = 2;
									searchUserBox.style.cursor = `pointer`;
								}
							},
							error: function(){
								searchUsername.innerHTML = "T1ch's API seems to be down right now.";
								searchBottomtext.innerHTML = "Please try again later.";
							}
						});
					}
					
					if(currentSelectedProvider == 3) {
						$.ajax({
							url: `https://api.nextcounts.com/api/youtube/channel/estimate/livecountsio/${dataa.cid}`,
							type: "GET",
							dataType: "JSON",
							success: function(data){
								if(data.error) {
									searchUsername.innerHTML = "Channel isn't estimated by Livecounts.io";
									searchBottomtext.innerHTML = "There's nothing we can do.";
								} else {
									searchUsername.innerHTML = dataa.displayName;
									searchPfp.src = dataa.pfp;
									searchBottomtext.innerHTML = `${(data.estimatedSubCount).toLocaleString()} Subscribers`;
									searchUsername.title = dataa.cid;
									searchProvider = 3;
									searchUserBox.style.cursor = `pointer`;
								}
							},
							error: function(){
								searchUsername.innerHTML = "Livecounts.io's API seems to be down right now.";
								searchBottomtext.innerHTML = "Please try again later.";
							}
						});
					}
					
					if(currentSelectedProvider == 4) {
						$.ajax({
							url: `https://estimates.ncinsiders.live/est/youtube/${dataa.cid}`,
							type: "GET",
							dataType: "JSON",
							success: function(data){
								if(data.msg) {
									searchUsername.innerHTML = "Channel isn't estimated by us.";
									searchBottomtext.innerHTML = "If the user has more than 100k subs, try again.";
								} else {
									searchUsername.innerHTML = data.channelName;
									searchPfp.src = data.channelImage;
									searchBottomtext.innerHTML = `${(data.estimatedCount).toLocaleString()} Subscribers`;
									searchUsername.title = dataa.cid;
									searchProvider = 4;
									searchUserBox.style.cursor = `pointer`;
								}
							},
							error: function(){
								searchUsername.innerHTML = "Our Estimated API seems to be down.";
								searchBottomtext.innerHTML = "Please try again later.";
							}
						});
					}
				}
			},
			error: function(){
				searchUsername.innerHTML = "Our API seems to be down right now.";
				searchBottomtext.innerHTML = "Please try again later.";
			}
		});
}

//Loads the actual data letsgooo
function loadDataFirstTime() {
	
	if (!providerInURL) {
		currentProvider = 0;
	} else {
		currentProvider = providerInURL;
	}
    
	function loadCounts() {
		if(currentProvider == 0) {
			$.ajax({
				url: `https://api.nextcounts.com/api/youtube/channel/${user}`,
				type: "GET",
				dataType: "JSON",
				success: function(data){
					if(data.error) {
						return;
					} else {
						updateCounts.mainCount(data.subcount);
						
						updateCounts.views(data.viewcount);
						updateCounts.videos(data.videos);
					}
				}
			});
		}
		
		if(currentProvider == 1) {
			$.ajax({
				url: `https://api.mixerno.space/youtube/estimated/user/${user}`,
				type: "GET",
				dataType: "JSON",
				success: function(data){
					if(data.msg) {
						return;
					} else {
						updateCounts.mainCount(data.SubscriberCount);
						
						updateCounts.views(data.totalviews);
						updateCounts.videos(data.videos);
					}
				}
			});
		}
		
		if(currentProvider == 2) {
			$.ajax({
				url: `https://api.livecounts.me/est/youtube/${user}/1456907299/6681084873`,
				type: "GET",
				dataType: "JSON",
				success: function(data){
					if(data.error) {
						return;
					} else {
						updateCounts.mainCount(data.subscriberCount);
						
						//updateCounts.views(data.viewcount);
						//updateCounts.videos(data.videos);
					}
				}
			});
		}
		
		if(currentProvider == 3) {
			$.ajax({
				url: `https://api.nextcounts.com/api/youtube/channel/estimate/livecountsio/${user}`,
				type: "GET",
				dataType: "JSON",
				success: function(data){
					if(data.error) {
						return;
					} else {
						updateCounts.mainCount(data.estimatedSubCount);
						
						updateCounts.views(data.views);
						updateCounts.videos(data.videos);
					}
				}
			});
		}
		
		if(currentProvider == 4) {
			$.ajax({
				url: `https://estimates.ncinsiders.live/est/youtube/${user}`,
				type: "GET",
				dataType: "JSON",
				success: function(data){
					if(data.error) {
						return;
					} else {
						updateCounts.mainCount(data.estimatedCount);
					}
				}
			});
			setInterval(function() {
				$.ajax({
					url: `https://api.nextcounts.com/api/youtube/channel/${user}`,
					type: "GET",
					dataType: "JSON",
					success: function(data){
						if(data.error) {
							return;
						} else {
							updateCounts.views(data.viewcount);
							updateCounts.videos(data.videos);
						}
					}
				});
			}, 60000)
		}
	}
	
    $.ajax({
        url: `https://api.nextcounts.com/api/youtube/channel/${user}`,
        type: "GET",
        dataType: "JSON",
        success: function(data){
            if(data.error) {
                toastr.options = {
                    "closeButton": true,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": true,
                    "positionClass": "toast-top-left",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1500",
                    "timeOut": "7000",
                    "extendedTimeOut": "2500",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                
                toastr["error"]("It seems like the user you requested doesn't exist. Please check if the @ of the user is correct.", "Uh oh...");
            } else {
                updateCounts.name(data.username);
                updateCounts.pfp(data.userImg);
				if(data.userBanner !== "" && data.userBanner !== undefined) {
					updateCounts.banner(data.userBanner);
				} else {
					updateCounts.banner("hide");
					hasBanner = false;
				}
                
                setInterval(function() {
                    loadCounts();
                }, 2000);
            }
        },
        error: function(){
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-left",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1500",
                "timeOut": "7000",
                "extendedTimeOut": "2500",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            
            toastr["error"]("It seems like our system is currently down for some unknown reason. Please message us on Twitter (@NextCounts) so we can quickly fix this issue.", "Uh oh...");
        }
    });
}

loadDataFirstTime();

//updates the content in the page
var updateCounts = {
    name: function(name) {
        document.getElementById('username').innerHTML = name;
    },
    pfp: function(url) {
        document.getElementById('userImg').src = url;
    },
    banner: function(url) {
        if(url == "hide") {
            document.getElementById('userBanner').style.opacity = `0`;
            document.getElementById('userImg').style.marginTop = `-80px`;
        } else {
            document.getElementById('userBanner').src = url;
        }
    },
    mainCount: function(count) {
        if(count >= 1) {
            document.getElementById('mainOdometer').innerHTML = count;
            
            if(updateChart == true) {
                if (chart.series[0].points.length >= maxPoints) {
                    chart.series[0].data[0].remove();
                }
                chart.series[0].addPoint([calcTime(), count]);
            }
        }
    },
    views: function(count) {
        document.getElementById('viewsOdo').innerHTML = count;
    },
    videos: function(count) {
        document.getElementById('videosOdo').innerHTML = count;
    }
}