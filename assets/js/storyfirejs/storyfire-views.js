//Stuff for the Chart & the actual chart

const textBright = "#F0F0F3";
const lineColor = "#707073";
const socialColor = "#f35d06";
const maxPoints = 900;

const chart = new Highcharts.chart({
    chart: {
        renderTo: "chart",
        type: "spline",
        zoomType: "x",
        backgroundColor: "transparent",
        plotBorderColor: "transparent",
    },
    title: {
        text: "",
    },
    xAxis: {
        type: "datetime",
        tickPixelInterval: 500,
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright,
            },
        },
        lineColor: lineColor,
        minorGridLineColor: "#505053",
        tickColor: lineColor,
        title: {
            style: {
                color: textBright,
            },
        },
    },
    yAxis: {
        title: {
            text: "",
        },
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright,
            },
        },
        lineColor: lineColor,
        minorGridLineColor: "#505053",
        tickColor: lineColor,
    },
    credits: {
        enabled: true,
        text: "NextCounts",
        href: "https://nextcounts.com"
    },

    series: [
        {
            showInLegend: false,
            name: "Views",
            marker: { enabled: false },
            color: socialColor,
            lineColor: socialColor,
        },
    ],
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

const videoInURL = urlParams.get("v");
const odometerInURL = urlParams.get("o");

if (!videoInURL) {
    video = "5e59f4bf44a4960028298236";
} else {
    video = videoInURL;
}

if (!odometerInURL || odometerInURL == 0 || odometerInURL == "normal") {
    $("head").append(
        '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">'
    );
}
if (odometerInURL == "1" || odometerInURL == "fast") {
    $("head").append(
        '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast.css">'
    );
}
if (odometerInURL == "2" || odometerInURL == "ncolored") {
    $("head").append(
        '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-colored.css">'
    );
}
if (odometerInURL == "3" || odometerInURL == "fcolored") {
    $("head").append(
        '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast-colored.css">'
    );
}

//"Customize counter" Modal code
var updateChart = true;
var bannerCurrent = 0;
var hasBanner = false;

$("#applyChangesCustomize").click(function () {
    //Odometer customizer
    if (odometerSelector.value == "fast") {
        $("link#odometerCSS").remove();
        $("head").append(
            '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast.css">'
        );
    } else if (odometerSelector.value == "ncolored") {
        $("link#odometerCSS").remove();
        $("head").append(
            '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-colored.css">'
        );
    } else if (odometerSelector.value == "fcolored") {
        $("link#odometerCSS").remove();
        $("head").append(
            '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast-colored.css">'
        );
    } else if (odometerSelector.value == "normal") {
        $("link#odometerCSS").remove();
        $("head").append(
            '<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">'
        );
    }

    //chart on/off switch
    if (disableChart.checked) {
        chart.series[0].setData([]);
        updateChart = false;
        document.getElementById("chart").style.display = "none";
    }

    if (!disableChart.checked && updateChart == false) {
        document.getElementById("chart").style.display = "block";
        updateChart = true;
    }
});

//Search for user - "Basic" Edition (Noice edition got cancelled, oof)
document.getElementById("searchBar").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        searchForUser();
    }
});

$("#searchBtn").click(function () {
    searchForUser();
});

function searchForUser() {
    var searchTerm = searchBar.value.replace("@", "");
    var username = "";
	var isVideoId = false;

    if (searchTerm.includes("https://") || searchTerm.includes("http://")) {
        var aaa = searchTerm.split("/");
        username = aaa[4];
		isVideoId = true;
    } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
        if (searchTerm.includes("storyfire.com/video-details/")) {
            var aaa = searchTerm.split("/");
            username = aaa[2];
			isVideoId = true;
        } else {
            username = searchTerm;
			isVideoId = false;
        }
    }
	
	if(isVideoId == true) {
		$.ajax({
			url: `https://api.nextcounts.com/api/storyfire/video/${username}`,
			type: "GET",
			dataType: "JSON",
			success: function (data) {
				if (data.error) {
					searchUsername.innerHTML = "Video not found.";
					searchBottomtext.innerHTML = "Please check if the URL is correct and try again.";
				}
				
				if(!data.errno && !data.error) {
					searchUsername.innerHTML = data.title;
					searchPfp.src = data.thumbnail;
					searchBottomtext.innerHTML = `${data.views.toLocaleString()} Views`;
					searchUsername.title = data.videoID;
					searchUserBox.style.cursor = `pointer`;
				}
			},
			error: function () {
				searchUsername.innerHTML = "Our API seems to be down right now.";
				searchBottomtext.innerHTML = "Please try again later.";
			},
		});
	} else {
		$.ajax({
			url: `https://api.nextcounts.com/api/storyfire/search/video/${username}`,
			type: "GET",
			dataType: "JSON",
			success: function (data) {
				if (data.error) {
					searchUsername.innerHTML = "No video found.";
					searchBottomtext.innerHTML = "Please check if the search term is correct and try again.";
				}
				
				if(!data.errno && !data.error) {
					searchUsername.innerHTML = data.title;
					searchPfp.src = data.thumbnail;
					searchBottomtext.innerHTML = `Uploader: ${data.uploader}`;
					searchUsername.title = data.videoID;
					searchUserBox.style.cursor = `pointer`;
				}
			},
			error: function () {
				searchUsername.innerHTML = "Our API seems to be down right now.";
				searchBottomtext.innerHTML = "Please try again later.";
			},
		});
	}
}

//Loads the actual data letsgooo
$('head').find('title')[0].text = `Live Storyfire Video Views Count`;
function loadDataFirstTime() {
    $.ajax({
        url: `https://api.nextcounts.com/api/storyfire/video/${video}`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.error) {
                toastr.options = {
                    closeButton: true,
                    debug: false,
                    newestOnTop: false,
                    progressBar: true,
                    positionClass: "toast-top-left",
                    preventDuplicates: true,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1500",
                    timeOut: "7000",
                    extendedTimeOut: "2500",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                };

                toastr["error"](
                    "It seems like the user you requested doesn't exist. Please check if the @ of the user is correct.",
                    "Uh oh..."
                );
            }
            if(!data.error && !data.errn) {
                $('head').find('title')[0].text = `Live Storyfire Video Views Count for "${data.title}"`;
                updateCounts.name(data.title);

                updateCounts.pfp(data.thumbnail);
                updateCounts.banner("hide");
                hasBanner = false;
				
                updateCounts.mainCount(data.views);

                updateCounts.comments(data.comments);
                updateCounts.likes(data.likes);
                updateCounts.subscribers(data.uploaderInfo.followersCount);

                setInterval(function () {
                    $.ajax({
                        url: `https://api.nextcounts.com/api/storyfire/video/${video}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (data) {
                            if (data.error || data.errno) {
                                return;
                            } else {
                                updateCounts.mainCount(data.views);

                                updateCounts.comments(data.comments);
                                updateCounts.likes(data.likes);
                                updateCounts.subscribers(data.uploaderInfo.followersCount);
                            }
                        },
                    });
                }, 2000);

            }
        },
        error: function () {
            toastr.options = {
                closeButton: true,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: "toast-top-left",
                preventDuplicates: true,
                onclick: null,
                showDuration: "300",
                hideDuration: "1500",
                timeOut: "7000",
                extendedTimeOut: "2500",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
            };

            toastr["error"](
                "It seems like our system is currently down for some unknown reason. Please message us on Twitter (@NextCounts) so we can quickly fix this issue.",
                "Uh oh..."
            );
        },
    });
}

loadDataFirstTime();

//updates the content in the page
var updateCounts = {
    name: function (name) {
        document.getElementById("username").innerHTML = name;
    },
    pfp: function (url) {
        document.getElementById("userImg").src = url;
    },
    banner: function (url) {
        if (url == "hide") {
            document.getElementById("userBanner").style.opacity = `0`;
            document.getElementById("userImg").style.marginTop = `-80px`;
        } else {
            document.getElementById("userBanner").src = url;
        }
    },
    mainCount: function (count) {
        document.getElementById("mainOdometer").innerHTML = count;

        if (updateChart == true) {
            if (chart.series[0].points.length >= maxPoints) {
                chart.series[0].data[0].remove();
            }
            chart.series[0].addPoint([calcTime(), count]);
        }
    },
    likes: function (count) {
        document.getElementById("likesOdo").innerHTML = count;
    },
    comments: function (count) {
        document.getElementById("commentsOdo").innerHTML = count;
    },
    subscribers: function (count) {
        document.getElementById("subsOdo").innerHTML = count;
    },
};
