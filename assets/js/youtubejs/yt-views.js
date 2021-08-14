//Stuff for the Chart & the actual chart

const textBright = "#F0F0F3";
const lineColor = "#707073";
const socialColor = "#ff0000";
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
            name: "Estimated View Count",
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
    videoid = "LeYsRMZFUq0";
} else {
    videoid = videoInURL;
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
var bannerCurrent = 1;
var hasBanner = true;

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

    //hide banner switch
    if (hideBanner.checked && hasBanner == true) {
        document.getElementById("userBanner").style.opacity = `0`;
        document.getElementById("userImg").style.marginTop = `-80px`;
        bannerCurrent = 0;
    }

    if (!hideBanner.checked && bannerCurrent == 0 && hasBanner == true) {
        document.getElementById("userBanner").style.opacity = `1`;
        document.getElementById("userImg").style.marginTop = `0px`;
        bannerCurrent = 1;
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

    if (searchTerm.includes("https://") || searchTerm.includes("http://")) {
        if (searchTerm.includes("youtube.com/watch?v=")) {
            var aaa = searchTerm.split("/");
            var bbb = aaa[3].replace("watch?v=", "");
            username = bbb;
        }

        if (searchTerm.includes("youtu.be")) {
            var aaa = searchTerm.split("/");
            username = aaa[3];
        }
    } else if (!searchTerm.includes("https://") || !searchTerm.includes("http://")) {
        if (searchTerm.includes("youtube.com/watch?v=")) {
            var aaa = searchTerm.split("/");
            var bbb = aaa[1].replace("watch?v=", "");
            username = bbb;
        }

        if (searchTerm.includes("youtu.be")) {
            var aaa = searchTerm.split("/");
            username = aaa[1];
        }
        
        username = searchTerm;
    }

    $.ajax({
        url: `https://api.nextcounts.com/api/youtube/video/search/${username}`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.error) {
                searchUsername.innerHTML = "Video not found.";
                searchBottomtext.innerHTML = "Please check if the spelling/url is correct and try again.";
            } else {
                searchUsername.innerHTML = data.videoTitle;
                searchPfp.src = data.thumbnails.medium.url;
                searchBottomtext.innerHTML = `Uploader: ${data.uploadercname}`;
                searchUsername.title = data.videoid;
                searchUserBox.style.cursor = `pointer`;
            }
        },
        error: function () {
            searchUsername.innerHTML = "Our API seems to be down right now.";
            searchBottomtext.innerHTML = "Please try again later.";
        },
    });
}

//Loads the actual data letsgooo
function loadDataFirstTime() {
    $.ajax({
        url: `https://api.nextcounts.com/api/youtube/video/info/${videoid}`,
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
                    "It seems like the video you requested doesn't exist. Please check if the video ID is correct.",
                    "Uh oh..."
                );
            }

            if(!data.error) {
                updateCounts.name(data.videoTitle);

                updateCounts.pfp(data.thumbnails.medium.url);

                updateCounts.banner("hide");
                hasBanner = false;

                setInterval(function () {
                    $.ajax({
                        url: `https://api.nextcounts.com/api/youtube/video/stats/${videoid}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (data) {
                            if (data.error) {
                                return;
                            } else {
                                var views = parseInt(data.views);
                                var likes = parseInt(data.likes);
                                var localLikeCount = parseInt(localStorage.getItem('likeCount-' + videoid));
                                var localViewCount = parseInt(localStorage.getItem('viewCount-' + videoid));
                                var ratio = views / likes;
                                if (localLikeCount == undefined || localLikeCount == null) {
                                    localStorage.setItem('likeCount-' + videoid, likes);
                                }
                                if (localViewCount != views) {
                                    localStorage.setItem('viewCount-' + videoid, views);
                                    localStorage.setItem('likeCount-' + videoid, likes);
                                }
                                var estViewCount = Math.round(views + (likes - localLikeCount) * ratio);


                                updateCounts.mainCount(estViewCount);

                                updateCounts.views(views);
                                updateCounts.likes(likes);
                                updateCounts.dislikes(data.dislikes);
                                updateCounts.comments(data.comments);
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
        if(!isNaN(count)) {
            document.getElementById("mainOdometer").innerHTML = count;
    
            if (updateChart == true) {
                if (chart.series[0].points.length >= maxPoints) {
                    chart.series[0].data[0].remove();
                }
                chart.series[0].addPoint([calcTime(), count]);
            }
        }
    },
    views: function (count) {
        document.getElementById("viewsOdo").innerHTML = count;
    },
    likes: function (count) {
        document.getElementById("likesOdo").innerHTML = count;
    },
    dislikes: function (count) {
        document.getElementById("dislikesOdo").innerHTML = count;
    },
    comments: function (count) {
        document.getElementById("commentsOdo").innerHTML = count;
    },
};
