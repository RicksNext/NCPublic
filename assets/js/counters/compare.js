toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-bottom-right",
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

if(localStorage.getItem("insiderMode") && localStorage.getItem("insiderMode") == 'true') {
    // TODO: CFG5788-1
} else {
    window.location.replace('/');
}
//Stuff for the Chart & the actual chart

const socialColors = {
	twitter: "#0a83f2",
	youtube: `#e01227`,
	twitch: `#9146FF`,
	tiktok: `#EE1D52`,
	triller: `#f7375d`,
	storyfire: `#f35d06`,
    discord: `#7289DA`,
    nextcountsv2: "#359add",
    nextcounts: "#20c997",
    mixerno: "#707073",
    instagram: "#F56040",
    parler: "#b80101",
    rumble: "#47ad4c",
    brime: "#fc3537"
};

const textBright = "#858585", lineColor = "#858585", socialColor = socialColors.nextcounts;

const customColors = [
    "#0076B1",
    "#CC1552",
    "#E4C722",
    "#7400DA",
    "#0a369d"
];

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
        type: "datetime",
        tickPixelInterval: 200,
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright,
            },
        },
        lineColor: lineColor,
        minorGridLineColor: "#858585",
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
});

const chart = new Highcharts.chart({
    chart: {
        renderTo: "gapchart"
    },
    series: [
        {
            showInLegend: false,
            name: "Gap",
            marker: { enabled: false },
            color: "#20c997",
            lineColor: "#20c997",
        },
    ],
});

var charts = [];

var firstChart, secondChart, ratesChart;

//time calc for generating charts

function calcTime() {
    var now = new Date();
    var time = now.getTime();
    var localOffset = -1 * now.getTimezoneOffset() * 60000;
    var newDate = new Date(time + localOffset).getTime();

    return newDate;
}

function higherLowerOrEqual(number1, number2, noOtherData) {
    if (number1 == null || number1 == undefined) number1 == number2;
    if (noOtherData == 1 || noOtherData == true) {
        return `<span class="badge badge-pill badge-primary" style="background: #f6c23e;">?</span>`
    } else {
        if (number1 > number2) {
            return `<span class="badge badge-pill badge-primary" style="background: #1cc88a;">+${(number1 - number2).toLocaleString()}</span>`;
        } else if (number1 < number2) {
            return `<span class="badge badge-pill badge-primary" style="background: #e74a3b;">${(number1 - number2).toLocaleString()}</span>`;
        } else if (number1 == number2) {
            return `<span class="badge badge-pill badge-primary" style="background: #858796;">+0</span>`;
        }
    }
};

function positiveOrNegative(number1, number2, id) {
    if (number1 == null || number1 == undefined) number1 == number2;
    if (number2 == null || number2 == undefined) number2 == number1;

    if (number1 > number2) {
        return `<p class="lead" style="color: #1cc88a;" id="${id}">+${(number1 - number2).toLocaleString()}</p>`;
    } else if (number1 < number2) {
        return `<p class="lead" style="color: #e74a3b;" id="${id}">${(number1 - number2).toLocaleString()}</p>`;
    } else if (number1 == number2) {
        return `<p class="lead" style="color: #858796;" id="${id}">+0</p>`;
    }
};

//URL Handler
const queryString = window.location.search, urlParams = new URLSearchParams(queryString);

var user1url = urlParams.get("u1"),
user2url = urlParams.get("u2"),
plat1url = urlParams.get("p1"),
plat2url = urlParams.get("p2"),
odometerInURL = urlParams.get("o");

var user1, user2, plat1, plat2 = '';

if (!user1url) {
    user1 = "UC-lHJZR3Gqxm24_Vd_AJ5Yw";
} else {
    user1 = user1url;
}
if (!user2url) {
    user2 = "UCX6OQ3DkcsbYNE6H8uQQuVA";
} else {
    user2 = user2url;
}
if (!plat1url) {
    plat1 = "youtubeuserest";
} else {
    plat1 = plat1url;
}
if (!plat2url) {
    plat2 = "youtubeuserest";
} else {
    plat2 = plat2url;
}

var validPlatforms = ["tiktokfollowers", "tiktokhearts", "twitteruser", "youtubeuserest", "youtubeuser", "ytvideoviews", "ytvideolikes", "ytvideocomments", "trilleruser", "discordserver", "twitchuser", "storyfirefollowers", "storyfireblaze", "brimefollowers", "rumbleuser", "parleruser"];

//"Customize counter" Modal code
var updateChart = true, updateUsersChart = true;
var hasBanner = true;

//Loads the actual data letsgooo

var prevCount = [];
var firstLive = [false, false];
var oldcounts = [0, 0];
var currcounts = [0, 0];

var rates = {
    counts: [[], []],
    vals: [0, 0],
    divisor: [0, 0],
    add: function (i, a) {
        if(!isNaN(a)) {
            a = Number(a);
            rates.vals[i] *= rates.counts[i].length;
            rates.counts[i].push(a);
            var sub = rates.counts[i].length > 60 ? rates.counts[i].shift() : 0;
            rates.vals[i] += a - sub;
            rates.vals[i] = (rates.vals[i] / rates.counts[i].length).toFixed(60);
        }
    },
};

function getTime(t) {
    var str = ["", "", "", "", "", " seconds"];
    var s = t,
        m = "",
        h = "",
        d = "",
        m = "",
        y = "";
    //minutes
    if (t >= 60) {
        str[4] = " minutes ";
        m = parseInt(t / 60);
        s -= m * 60;
    }
    //hours
    if (t >= 3600) {
        str[3] = " hours ";
        h = parseInt(t / 3600);
        m -= h * 60;
    }
    //days
    if (t >= 86400) {
        str[2] = " days ";
        d = parseInt(t / 86400);
        h -= d * 24;
    }
    return d + str[2] + h + str[3] + m + str[4] + s + str[5];
}

var countzero, countone;
var tableone, tabletwo, tablegap;
var firstLoad = [true, true];
var chartSeries = [];

function loadUser(platform, user, number) {
    switch(platform) {
        case "tiktokfollowers":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/tiktok/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers ${socialBadges.tiktok}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.tiktok}` : `${data.username} ${socialBadges.tiktok} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followers,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followers && !isNaN(data.followers) ? data.followers / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.tiktok,
                                            lineColor: socialColors.tiktok,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followers;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/tiktokuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.tiktok,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/tiktok/user/stats/${data.uid}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followers;
                                                updateCounts.mainCount(dataa.followers, number);
                                                updateCounts.goalCount(dataa.followers, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followers, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followers;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followers - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followers;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "tiktokhearts":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/tiktok/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Hearts ${socialBadges.tiktok}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.tiktok}` : `${data.username} ${socialBadges.tiktok} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.hearts,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.hearts && !isNaN(data.hearts) ? data.hearts / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Hearts/Likes",
                                            marker: { enabled: false },
                                            color: socialColors.tiktok,
                                            lineColor: socialColors.tiktok,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.hearts;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/tiktokuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.hearts[ndata.hearts.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.hearts,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.tiktok,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Likes - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/tiktok/user/stats/${data.uid}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.hearts;
                                                updateCounts.mainCount(dataa.hearts, number);
                                                updateCounts.goalCount(dataa.hearts, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.hearts, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.hearts;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.hearts - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.hearts;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "youtubeuserest":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/youtube/channel/estimate/mixerno/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.channelName} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.channelName, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Subscribers ${socialBadges.youtube}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.channelName} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.channelName} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.channelName} ${socialBadges.youtube}` : `${data.channelName} ${socialBadges.youtube} Vs. `;

                                updateCounts.name(data.channelName, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.estimatedSubCount,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.estimatedSubCount && !isNaN(data.estimatedSubCount) ? data.estimatedSubCount / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Subscribers",
                                            marker: { enabled: false },
                                            color: socialColors.youtube,
                                            lineColor: socialColors.youtube,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.estimatedSubCount;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/youtubeuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.mixerno.subscribers[ndata.mixerno.subscribers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.mixerno.subscribers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.channelName} - Subscribers Count`,
                                        type: 'spline',
                                        color: socialColors.youtube,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Subscribers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/youtube/channel/estimate/mixerno/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.estimatedSubCount;
                                                updateCounts.mainCount(dataa.estimatedSubCount, number);
                                                updateCounts.goalCount(dataa.estimatedSubCount, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.estimatedSubCount, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.estimatedSubCount;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.estimatedSubCount - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.estimatedSubCount;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "youtubeuser":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/youtube/channel/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Subscribers ${socialBadges.youtube}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.youtube}` : `${data.username} ${socialBadges.youtube} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.userImg, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.subcount,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.subcount && !isNaN(data.subcount) ? data.subcount / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Subscribers",
                                            marker: { enabled: false },
                                            color: socialColors.youtube,
                                            lineColor: socialColors.youtube,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.subcount;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/youtubeuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.ytapi.subscribers[ndata.ytapi.subscribers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.ytapi.subscribers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Subscribers Count`,
                                        type: 'spline',
                                        color: socialColors.youtube,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Subscribers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/youtube/channel/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.subcount;
                                                updateCounts.mainCount(dataa.subcount, number);
                                                updateCounts.goalCount(dataa.subcount, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.subcount, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.subcount;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.subcount - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.subcount;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "twitteruser":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/twitter/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (dataone) {
                        if (dataone.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            let data = dataone.users[0];

                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers ${socialBadges.twitter}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.twitter}` : `${data.username} ${socialBadges.twitter} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.pfp.large, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followers,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followers && !isNaN(data.followers) ? data.followers / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.twitter,
                                            lineColor: socialColors.twitter,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followers;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/twitteruser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.twitter,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/twitter/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (datatwo) {
                                            if(datatwo.success == true) {
                                                let dataa = datatwo.users[0];

                                                currcounts[number - 1] = dataa.followers;
                                                updateCounts.mainCount(dataa.followers, number);
                                                updateCounts.goalCount(dataa.followers, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followers, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followers;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followers - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followers;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "trilleruser":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/triller/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers ${socialBadges.triller}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.triller}` : `${data.username} ${socialBadges.triller} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followers,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followers && !isNaN(data.followers) ? data.followers / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.triller,
                                            lineColor: socialColors.triller,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followers;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/trilleruser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.triller,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/triller/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followers;
                                                updateCounts.mainCount(dataa.followers, number);
                                                updateCounts.goalCount(dataa.followers, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followers, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followers;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followers - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followers;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "ytvideoviews":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.results[0].title, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Views ${socialBadges.youtube}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.results[0].title} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.results[0].title} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.results[0].title} ${socialBadges.youtube}` : `${data.results[0].title} ${socialBadges.youtube} Vs. `;

                                updateCounts.name(data.results[0].title, number);
    
                                updateCounts.pfp(data.results[0].thumbnails.medium.url, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: 0,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Views",
                                            marker: { enabled: false },
                                            color: socialColors.youtube,
                                            lineColor: socialColors.youtube,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = 0;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/youtubevideo/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.views[ndata.views.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.views,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Views Count`,
                                        type: 'spline',
                                        color: socialColors.youtube,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Views - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(dataa.success == true) {
                                                var views = parseInt(dataa.views);
                                                var likes = parseInt(dataa.likes);
                                                var localLikeCount = parseInt(localStorage.getItem('likeCount-' + user));
                                                var localViewCount = parseInt(localStorage.getItem('viewCount-' + user));
                                                var ratio = views / likes;
                                                if (localLikeCount == undefined || localLikeCount == null) {
                                                    localStorage.setItem('likeCount-' + user, likes);
                                                }
                                                if (localViewCount != views) {
                                                    localStorage.setItem('viewCount-' + user, views);
                                                    localStorage.setItem('likeCount-' + user, likes);
                                                }
                                                var estViewCount = Math.round(views + (likes - localLikeCount) * ratio);


                                                currcounts[number - 1] = estViewCount;
                                                updateCounts.mainCount(estViewCount, number);
                                                updateCounts.goalCount(estViewCount, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(estViewCount, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = estViewCount;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, estViewCount - prevCount[number - 1]);
                                                    prevCount[number - 1] = estViewCount;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "ytvideolikes":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.results[0].title, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Likes ${socialBadges.youtube}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.results[0].title} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.results[0].title} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.results[0].title} ${socialBadges.youtube}` : `${data.results[0].title} ${socialBadges.youtube} Vs. `;

                                updateCounts.name(data.results[0].title, number);
    
                                updateCounts.pfp(data.results[0].thumbnails.medium.url, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: 0,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Likes",
                                            marker: { enabled: false },
                                            color: socialColors.youtube,
                                            lineColor: socialColors.youtube,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = 0;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/youtubevideo/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.likes[ndata.likes.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.likes,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Likes Count`,
                                        type: 'spline',
                                        color: socialColors.youtube,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Likes - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(dataa.success == true) {
                                                currcounts[number - 1] = dataa.likes;
                                                updateCounts.mainCount(dataa.likes, number);
                                                updateCounts.goalCount(dataa.likes, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.likes, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.likes;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.likes - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.likes;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "ytvideocomments":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.results[0].title, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Comments ${socialBadges.youtube}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.results[0].title} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.results[0].title} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.results[0].title} ${socialBadges.youtube}` : `${data.results[0].title} ${socialBadges.youtube} Vs. `;

                                updateCounts.name(data.results[0].title, number);
    
                                updateCounts.pfp(data.results[0].thumbnails.medium.url, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: 0,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Comments",
                                            marker: { enabled: false },
                                            color: socialColors.youtube,
                                            lineColor: socialColors.youtube,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = 0;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/youtubevideo/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.comments[ndata.comments.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.comments,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Comments Count`,
                                        type: 'spline',
                                        color: socialColors.youtube,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Comments - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(dataa.success == true) {
                                                currcounts[number - 1] = dataa.comments;
                                                updateCounts.mainCount(dataa.comments, number);
                                                updateCounts.goalCount(dataa.comments, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.comments, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.comments;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.comments - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.comments;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "discordserver":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/discord/server/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.guild.serverName, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Members ${socialBadges.discord}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.guild.serverName} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.guild.serverName} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.guild.serverName} ${socialBadges.discord}` : `${data.guild.serverName} ${socialBadges.discord} Vs. `;

                                updateCounts.name(data.guild.serverName, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.membersCount,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.membersCount && !isNaN(data.membersCount) ? data.membersCount / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Total Members",
                                            marker: { enabled: false },
                                            color: socialColors.discord,
                                            lineColor: socialColors.discord,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.membersCount;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/discordserver/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.totalMembers[ndata.totalMembers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.totalMembers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Total Members Count`,
                                        type: 'spline',
                                        color: socialColors.discord,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Total Members - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/discord/server/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.membersCount;
                                                updateCounts.mainCount(dataa.membersCount, number);
                                                updateCounts.goalCount(dataa.membersCount, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.membersCount, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.membersCount;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.membersCount - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.membersCount;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "twitchuser":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/twitch/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.partner == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers ${socialBadges.twitch}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.twitch}` : `${data.username} ${socialBadges.twitch} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.pfp, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followers,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followers && !isNaN(data.followers) ? data.followers / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.twitch,
                                            lineColor: socialColors.twitch,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followers;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/twitchuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.twitch,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/twitch/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followers;
                                                updateCounts.mainCount(dataa.followers, number);
                                                updateCounts.goalCount(dataa.followers, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followers, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followers;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followers - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followers;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "storyfirefollowers":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/storyfire/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.username, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Subscribers ${socialBadges.storyfire}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.storyfire}` : `${data.username} ${socialBadges.storyfire} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.userImg, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followers,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followers && !isNaN(data.followers) ? data.followers / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Subscribers",
                                            marker: { enabled: false },
                                            color: socialColors.storyfire,
                                            lineColor: socialColors.storyfire,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followers;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/storyfireuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Subscribers Count`,
                                        type: 'spline',
                                        color: socialColors.storyfire,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Subscribers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/storyfire/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followers;
                                                updateCounts.mainCount(dataa.followers, number);
                                                updateCounts.goalCount(dataa.followers, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followers, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followers;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followers - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followers;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "storyfireblaze":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/storyfire/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.username, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Blaze ${socialBadges.storyfire}`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username} ${socialBadges.storyfire}` : `${data.username} ${socialBadges.storyfire} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.userImg, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.blaze,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.blaze && !isNaN(data.blaze) ? data.blaze / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Blaze",
                                            marker: { enabled: false },
                                            color: socialColors.storyfire,
                                            lineColor: socialColors.storyfire,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.blaze;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/storyfireuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.blaze[ndata.blaze.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.blaze,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Blaze Count`,
                                        type: 'spline',
                                        color: socialColors.storyfire,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Blaze - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/storyfire/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.blaze;
                                                updateCounts.mainCount(dataa.blaze, number);
                                                updateCounts.goalCount(dataa.blaze, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.blaze, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.blaze;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.blaze - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.blaze;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "brimefollowers":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/brime/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.username} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.username, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.username} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.username} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.username}` : `${data.username} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followers,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followers && !isNaN(data.followers) ? data.followers / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.brime,
                                            lineColor: socialColors.brime,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followers;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/brimeuser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.username} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.brime,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/brime/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followers;
                                                updateCounts.mainCount(dataa.followers, number);
                                                updateCounts.goalCount(dataa.followers, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followers, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followers;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followers - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followers;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "rumbleuser":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/rumble/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                if (data.verified == true) {
                                    updateCounts.name(`${data.nickname} ${socialBadges.verified}`, number);
                                } else {
                                    updateCounts.name(data.nickname, number);
                                }

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.nickname} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.nickname} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.nickname}` : `${data.nickname} Vs. `;

                                updateCounts.name(data.username, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followersCount,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followersCount && !isNaN(data.followersCount) ? data.followersCount / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.rumble,
                                            lineColor: socialColors.rumble,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followersCount;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/trilleruser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.nickname} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.rumble,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/rumble/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followersCount;
                                                updateCounts.mainCount(dataa.followersCount, number);
                                                updateCounts.goalCount(dataa.followersCount, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followersCount, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followersCount;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followersCount - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followersCount;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        case "parleruser":
            if(firstLoad[number - 1] == true) {
                $.ajax({
                    url: `https://api-v2.nextcounts.com/api/parler/user/${user}`,
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        if (data.error) {
                            if(firstLoad[number - 1] == true) toastr["error"]("It seems like one of the users you requested doesn't exist. Please check if the @ of the user is correct. - User " + number, "Uh oh...");
                        } else {
                            if(firstLoad[number - 1] == true) {
                                updateCounts.name(data.nickname, number);

                                document.getElementById(`bottomtext-${number}`).innerHTML = `Followers`;
                                document.getElementById(`${number}0label`).innerHTML = `${data.nickname} Gains`;
                                document.getElementById(`gainsheader${number}`).innerHTML = `${data.nickname} Today`;
                                
                                document.getElementById(`topheading`).innerHTML += document.getElementById(`topheading`).innerHTML.includes('Vs') ? `${data.nickname}` : `${data.nickname} Vs. `;

                                updateCounts.name(data.nickname, number);
    
                                updateCounts.pfp(data.avatar, number);
                                updateCounts.banner("hide", number);
                                hasBanner = false;
                
                                new Odometer({
                                    el: document.getElementById("mainOdometer-"+number),
                                    value: data.followersCount,
                                    format: '(,ddd).dd',
                                });
                
                                new Odometer({
                                    el: document.getElementById(`user${number}goal`),
                                    value: data.followersCount && !isNaN(data.followersCount) ? data.followersCount / 2 : 0,
                                    format: '(,ddd).dd',
                                });

                                charts[number - 1] = new Highcharts.chart({
                                    chart: {
                                        renderTo: `userchart-${number}`
                                    },
                                    series: [
                                        {
                                            showInLegend: false,
                                            name: "Followers",
                                            marker: { enabled: false },
                                            color: socialColors.parler,
                                            lineColor: socialColors.parler,
                                        },
                                    ],
                                });

                                firstLoad[number - 1] = false;
                                currcounts[number - 1] = data.followersCount;

                                
                                $.ajax(`https://api-v2.nextcounts.com/api/stats/parleruser/${user}`)
                                .done(function (stats) {
                                    try { JSON.parse(stats); } catch { toastr["info"](stats); };

                                    var ndata = JSON.parse(stats);
                                    
                                    oldcounts[number - 1] = ndata.followers[ndata.followers.length - 1][1];

                                    chartSeries.push({
                                        data: ndata.followers,
                                        marker: {
                                            enabled: false
                                        },
                                        name: `${data.nickname} - Follower Count`,
                                        type: 'spline',
                                        color: socialColors.parler,
                                        fillOpacity: 0.3
                                    });

                                    setTimeout(function() {
                                        new Highcharts.chart(document.getElementById(`mainGraph`), {
                                            chart: {
                                                zoomType: "x",
                                                backgroundColor: "transparent",
                                                plotBorderColor: "transparent",
                                            },
                                            title: {
                                                text: `Followers - Historical Comparison`,
                                                align: 'left',
                                                style: {
                                                    color: textBright,
                                                },
                                            },
                                            credits: {
                                                enabled: true,
                                                text: "NextCounts Analytics",
                                                href: "https://nextcounts.com"
                                            },
                                            legend: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                type: "datetime",
                                                crosshair: true,
                                                labels: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                                gridLineColor: lineColor,
                                                lineColor: lineColor,
                                                minorGridLineColor: "#858585",
                                                tickColor: lineColor,
                                                title: {
                                                    style: {
                                                        color: textBright,
                                                    },
                                                },
                                            },
                                            yAxis: {
                                                title: {
                                                    text: null
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
                                            series: chartSeries
                                        });
                                    }, 3500);
                                });

                                setTimeout(function() {
                                    new Odometer({
                                        el: document.getElementById(`gapcounter`),
                                        value: 0,
                                        format: '(,ddd).dd',
                                    });
                                }, 500);
            
                                setInterval(function () {
                                    $.ajax({
                                        url: `https://api-v2.nextcounts.com/api/parler/user/${user}`,
                                        type: "GET",
                                        dataType: "JSON",
                                        success: function (dataa) {
                                            if(data.success == true) {
                                                currcounts[number - 1] = dataa.followersCount;
                                                updateCounts.mainCount(dataa.followersCount, number);
                                                updateCounts.goalCount(dataa.followersCount, number);
                    
                                                $(`#user${number}gains`)[0].innerHTML = positiveOrNegative(dataa.followersCount, oldcounts[number - 1], `user${number}gains`);
                                                
                                                if (!firstLive[number - 1]) {
                                                    prevCount[number - 1] = dataa.followersCount;
                                                    firstLive[number - 1] = true;
                                                } else {
                                                    rates.add(number - 1, dataa.followersCount - prevCount[number - 1]);
                                                    prevCount[number - 1] = dataa.followersCount;
                    
                                                    var avgRate = rates.vals[number - 1]/2;
                    
                                                    var final1 = Math.round(avgRate * 60).toLocaleString();
                                                    var final2 = Math.round(avgRate * 3600).toLocaleString();
                                                    var final3 = Math.round(avgRate * 86400).toLocaleString();
                                                    updateCounts.avgs[number - 1](final1, final2, final3);
                                                }
                                            }
                                        }, error: function () { }
                                    });
                                }, 2000);
                            } else {
                                //
                            }
                        }
                    },
                    error: function () { },
                });
            } else return;
            break;
        default:
            toastr["error"](`It seems like the platform you selected (${platform}) isn't available in the compare page for NextCounts. Please check the spelling or replace it with a different platform.`, "Uh oh...");
            break;
    }

    setTimeout(function() {

        var ratecolorone, ratecolortwo = customColors[Math.round(customColors.length * Math.random())];

        ratesChart = new Highcharts.chart({
            chart: {
                renderTo: "ratesChart"
            },
            title: {
                text: `Per minute gain rate - Chart Graph`,
                align: 'left',
                style: {
                    color: textBright,
                },
            },
            series: [
                {
                    showInLegend: false,
                    name: `${$('#username-1')[0].innerHTML} - Gain Rate`,
                    marker: { enabled: false },
                    color: ratecolorone,
                    lineColor: ratecolorone,
                },
                {
                    showInLegend: false,
                    name: `${$('#username-2')[0].innerHTML} - Gain Rate`,
                    marker: { enabled: false },
                    color: ratecolortwo,
                    lineColor: ratecolortwo,
                },
            ],
        });
        setInterval(function() {
            document.getElementById(`gapcounter`).innerHTML = currcounts[0] - currcounts[1];
    
            if(currcounts[0] > 1 && currcounts[1] > 1) {
    
                var more = currcounts[0] > currcounts[1] ? 0 : 1,
                less = 1 - more;

                var gap = Math.abs(currcounts[more] - currcounts[less]);

                var secsLeft = parseInt(gap / (rates.vals[less] - rates.vals[more]));
                $("#takeover").html(secsLeft >= 0 ? getTime(secsLeft) : "Never");
            }
    
            if (updateChart == true && firstLoad[0] == false && firstLoad[1] == false && currcounts[0] != 0 && currcounts[1] != 0) {
                if (chart.series[0].points.length >= maxPoints) {
                    chart.series[0].data[0].remove();
                }
                chart.series[0].addPoint([calcTime(), currcounts[0] - currcounts[1]]);
                
                if (ratesChart.series[0].points.length >= maxPoints || ratesChart.series[1].points.length >= maxPoints) {
                    ratesChart.series[0].data[0].remove();
                    ratesChart.series[1].data[0].remove();
                }
                ratesChart.series[0].addPoint([calcTime(), Math.floor($('#11min')[0].innerHTML)]);
                ratesChart.series[1].addPoint([calcTime(), Math.floor($('#21min')[0].innerHTML)]);
            }
        }, 2000);
    }, 5000);
}

var searchUser1 = "", searchUser2 = "", searchPlat1 = "", searchPlat2 = "";

function searchForUser(user, platform, num) {

    if(user == "") return toastr["warning"]("You need to provide an username for the search to work!", "Oops!");

    switch (platform) {
        case "twitteruser":
            var e = user.replace("@", ""), t = "";
            if (e.includes("https://") || e.includes("http://")) {
                var n = e.split("/");
                t = n[3]
            } else {
                if (e.includes("twitter.com")) {
                    n = e.split("/");
                    t = n[1]
                } else t = e;
            }

            $.ajax({
                url: `hhttps://api-v2.nextcounts.com/api/search/twitter/user/${t}`,
                type: "GET",
                dataType: "JSON",
                success: function (data) {
                    if (data.errors) {
                        toastr["error"](`It seems like the user you entered (${user}) isn't on Twitter. Please check the spelling or replace it with a different username.`, "Uh oh...");
                    } else {
                        if (data.verified == true) {
                            if (data.lockedAcc == true) {
                                $(`searchUsername-${num}`)[0].innerHTML = `${data.name} ${socialBadges.verified} ${socialBadges.lockedAcc} ${socialBadges.twitter}`;
                            } else {
                                $(`searchUsername-${num}`)[0].innerHTML = `${data.name} ${socialBadges.verified} ${socialBadges.twitter}`;
                            }
                        } else {
                            if (data.lockedAcc == true) {
                                $(`searchUsername-${num}`)[0].innerHTML = `${data.name} ${socialBadges.lockedAcc} ${socialBadges.twitter}`;
                            } else {
                                $(`searchUsername-${num}`)[0].innerHTML = `${data.name} ${socialBadges.twitter}`;
                            }
                        }

                        $(`searchSubtitle-${num}`)[0].innerHTML = `${(data.followers).toLocaleString()} Followers`;
                        searchUser1 = data.userDefiner;
                        searchPlat1 = "twitteruser";
                    }
                },
                error: function () { },
            });
            break;     
    }
}

$(document).ready(function () {
    $('#searchSelect-1').append(`<option value=3 selected="">Select a Platform</option>`);
    $('#searchSelect-1').append(`<option value="twitteruser">Twitter (User)</option>`);

    $('#searchSelect-2').append(`<option value=3 selected="">Select a Platform</option>`);
    $('#searchSelect-2').append(`<option value="twitteruser">Twitter (User)</option>`);

    loadUser(plat1, user1, 1);
    loadUser(plat2, user2, 2);
});


//updates the content in the page
var updateCounts = {
    name: function (name, user) {
        document.getElementById(`username-${user}`).className = document.getElementById(`username-${user}`).className.replace("skeleton skeleton-text", "");
        document.getElementById(`username-${user}`).innerHTML = name;
    },
    pfp: function (url, user) {
        document.getElementById(`userImg-${user}`).src = url;
    },
    banner: function (url, user) {
        if (url == "hide") {
            document.getElementById(`userBanner-${user}`).style.opacity = `0`;
            document.getElementById(`userImg-${user}`).style.marginTop = `-80px`;
        } else {
            document.getElementById(`userBanner-${user}`).src = url;
        }
    },
    mainCount: function (count, user) {
        document.getElementById(`mainOdometer-${user}`).innerHTML = count;

        if (updateUsersChart == true && firstLoad[user - 1] == false) {
            if (charts[user - 1].series[0].points.length >= maxPoints) {
                charts[user - 1].series[0].data[0].remove();
            }
            charts[user - 1].series[0].addPoint([calcTime(), count]);
        }
    },
    goalCount: function (count, user) {
        if (count < 10) {
            var final = 10;
        }
        var exponent = Math.floor(Math.log10(count));
        var factor = Math.ceil(count / 10 ** exponent);
        var semifinal = factor * 10 ** exponent;
        var final = semifinal - count;

        document.getElementById(`user${user}goalheader`).innerHTML = `Left to ${abbreviateGivenNumber(semifinal)}`;

        document.getElementById(`user${user}goal`).innerHTML = final;
    },
    avgs: [
        function(val1, val2, val3) {
            $("#11min").html(val1);
            $("#11hour").html(val2);
            $("#124hrs").html(val3);
        },
        function(val1, val2, val3) {
            $("#21min").html(val1);
            $("#21hour").html(val2);
            $("#224hrs").html(val3);
        }
    ]
};
