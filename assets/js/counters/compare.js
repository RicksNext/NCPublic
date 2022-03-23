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

const textBright = "#858585", lineColor = "#858585", socialColor = "#20c997";

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

const customColors = [
    "#0076B1",
    "#000D38",
    "#CC1552",
    "#E4C722",
    "#7400DA",
    "#fe5f55",
    //"#53b3cb",
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
    user1 = "elonmusk";
} else {
    user1 = user1url;
}
if (!user2url) {
    user2 = "ladygaga";
} else {
    user2 = user2url;
}
if (!plat1url) {
    plat1 = "twitteruser";
} else {
    plat1 = plat1url;
}
if (!plat2url) {
    plat2 = "twitteruser";
} else {
    plat2 = plat2url;
}

var validPlatforms = ["tiktokuser", "twitteruser", "youtubeuser", "youtubevideo", "trilleruser", "discordserver", "twitchuser"];

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
        a = Number(a);
        rates.vals[i] *= rates.counts[i].length;
        rates.counts[i].push(a);
        var sub = rates.counts[i].length > 60 ? rates.counts[i].shift() : 0;
        rates.vals[i] += a - sub;
        rates.vals[i] = (rates.vals[i] / rates.counts[i].length).toFixed(60);
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
                    name: `${$('#username-1')[0].innerHTML} - Follower Rate`,
                    marker: { enabled: false },
                    color: ratecolorone,
                    lineColor: ratecolorone,
                },
                {
                    showInLegend: false,
                    name: `${$('#username-2')[0].innerHTML} - Follower Rate`,
                    marker: { enabled: false },
                    color: ratecolortwo,
                    lineColor: ratecolortwo,
                },
            ],
        });
        setInterval(function() {
            document.getElementById(`gapcounter`).innerHTML = currcounts[0] - currcounts[1];
    
            if(currcounts[0] > 1 && currcounts[1] > 1) {
                var gap = Math.floor(currcounts[0] - currcounts[1]);
    
                var more = currcounts[0] > currcounts[1] ? 0 : 1, less = 1 - more;
                var secsLeft = parseInt(gap / (rates.vals[more] - rates.vals[less]));
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
    }, 3000);
}


loadUser(plat1, user1, 1);loadUser(plat2, user2, 2);

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
