//Stuff for the Chart & the actual chart

const textBright = "#F0F0F3";
const lineColor = "#707073";
const socialColor = "#F77737";
var maxPoints = 900;

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
            name: "Followers",
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

const userInURL = urlParams.get("u");
const odometerInURL = urlParams.get("o");

if (!userInURL) {
    user = "instagram";
} else {
    user = userInURL;
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
        var aaa = searchTerm.split("/");
        username = aaa[3];
    } else if (
        !searchTerm.includes("https://") ||
        !searchTerm.includes("http://")
    ) {
        if (searchTerm.includes("instagram.com")) {
            var aaa = searchTerm.split("/");
            username = aaa[1];
        } else {
            username = searchTerm;
        }
    }

    $.ajax({
        url: `https://api.nextcounts.com/api/instagram/user/search/${username}`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.error) {
                searchUsername.innerHTML = "No user found.";
                searchBottomtext.innerHTML = "Please check if the spelling is correct and try again.";
            } else {
                searchUsername.innerHTML = data.username;
                searchPfp.src = data.pfp;
                searchBottomtext.innerHTML = `@${data.id}`;
                searchUsername.title = data.id;
                searchUserBox.style.cursor = `pointer`;
            }
        },
        error: function () {
            searchUsername.innerHTML = "Oops!";
            searchBottomtext.innerHTML = "An error just happened.";
        },
    });
}

//Loads the actual data letsgooo
$('head').find('title')[0].text = `Live Instagram Follower Count`;

function loadDataFirstTime() {
    $.ajax({
        url: `https://api.nextcounts.com/api/instagram/user/info/${user}`,
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
            } else {
                if (data.verified == true) {
                    updateCounts.name(`${data.username} <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
                } else {
                    updateCounts.name(data.username);
                }

                $('head').find('title')[0].text = `Live Instagram Follower Count for ${data.username}`;
                updateCounts.pfp(data.pfp);
                updateCounts.banner("hide");
                hasBanner = false;
				
                setInterval(function () {
                    $.ajax({
                        url: `https://api.nextcounts.com/api/instagram/user/data/${user}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (data) {
                            updateCounts.mainCount(data.followers);
                                    
                            updateCounts.posts(data.posts);
                            updateCounts.goalCount(data.followers);
                        }, error: function() {}
                    });
                }, 5000);
            }
        },
        error: function () {},
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
    goalCount: function (count) {
        if (count < 10) {
            var final = 10;
        }
        var exponent = Math.floor(Math.log10(count));
        var factor = Math.ceil(count / 10 ** exponent);
        var semifinal = factor * 10 ** exponent;
        var final = semifinal - count;

        document.getElementById("goalOdo").innerHTML = final;
    },
    posts: function (count) {
        document.getElementById("postsOdo").innerHTML = count;
    },
};
