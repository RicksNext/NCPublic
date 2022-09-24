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
	twitter: "#3498db",
	youtube: `#FF0000`,
	twitch: `#6441a5`,
	tiktok: `#EE1D52`,
	triller: `#f7375d`,
	storyfire: `#f35d06`,
    discord: `#7289DA`,
    nextcountsv2: "#359add",
    nextcounts: "#20c997",
    mixerno: "#707073"
};

const textBright = "#858585", lineColor = "#858585", socialColor = socialColors.nextcounts;

const customColors = [
    "#0076B1",
    "#CC1552",
    "#E4C722",
    "#7400DA",
    "#fe5f55",
    "#59a96a",
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

var validPlatforms = ["tiktokuser", "twitteruser", "youtubeuserest", "youtubeuser", "youtubevideo", "trilleruser", "discordserver", "twitchuser"];

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
        case "tiktokuser":
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

                                
                                $.ajax(`https://statsapi.nextcounts.com/tiktokuser/${user}`)
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

                                
                                $.ajax(`https://statsapi.nextcounts.com/youtubeuser/${user}`)
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

                                
                                $.ajax(`https://statsapi.nextcounts.com/youtubeuser/${user}`)
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

                                
                                $.ajax(`https://statsapi.nextcounts.com/twitteruser/${user}`)
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

                                
                                $.ajax(`https://statsapi.nextcounts.com/trilleruser/${user}`)
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

    const socialBadges = {
        verified: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        lockedAcc: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitter"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path></svg>',
        youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="5" width="18" height="14" rx="4"></rect><path d="M10 9l5 3l-5 3z"></path></svg>',
        twitch: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitch"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z"></path><line x1="16" y1="8" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="12"></line></svg>',
        tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5"></path></svg>',
        soundcloud: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-soundcloud"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z"></path><line x1="9" y1="8" x2="9" y2="17"></line><line x1="6" y1="17" x2="6" y2="10"></line><line x1="3" y1="16" x2="3" y2="14"></line></svg>',
        reddit: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-reddit"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z"></path><path d="M12 8l1-5 6 1"></path><circle cx="19" cy="4" r="1"></circle><circle cx="9" cy="13" r=".5" fill="currentColor"></circle><circle cx="15" cy="13" r=".5" fill="currentColor"></circle><path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5"></path></svg>',
        discord: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path><path d="M7 16.5c3.5 1 6.5 1 10 0"></path><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5"></path><path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5"></path></svg>',
        storyfire: '<i class="fas fa-fire"></i>',
        nextcounts: '<i class="fas fa-chart-line" id="brand-logo"></i>'
    };

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
