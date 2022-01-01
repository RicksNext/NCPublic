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
$('#liveSpinner').hide();

//Stuff for the Chart & the actual chart

const textBright = "#858585";
const lineColor = "#858585";
const socialColor = "#9146FF";
var maxPoints = 900;

const chart = new Highcharts.chart({
    chart: {
        renderTo: "mainchart",
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

const userInURL = urlParams.get("u"), odometerInURL = urlParams.get("o");
var user = "";

!userInURL ? user = "ninja" : user = userInURL;

//"Customize counter" Modal code
var updateChart = true;
var bannerCurrent = 1;
var hasBanner = true;

//Loads the actual data letsgooo

var prevCount = [];
var firstLive = [false, false, false];
var oldFollowers = 0;
var oldViews = 0;

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

function loadDataFirstTime() {
    $.ajax({
        url: `https://api-v2.nextcounts.com/api/search/twitch/user/${user}`,
        type: "GET",
        dataType: "JSON",
        success: function (dataa) {
            if (dataa.error) {
                toastr["error"](
                    "It seems like the user you requested doesn't exist or wasn't found. Please check if the user is correct.",
                    "Uh oh..."
                );
            } else {
                if(dataa.results[dataa.results.findIndex(e => (e.username).toLowerCase() == user)] == -1) {
                    toastr["error"](
                        "It seems like the user you requested wasn't found. Please check if the user is correct and try again, or refresh the page.",
                        "Uh oh..."
                    );
                } else {
                    let usdt = dataa.results[dataa.results.findIndex(e => (e.username).toLowerCase() == user)];

                    if (usdt.partner == true) {
                        updateCounts.name(`${usdt.username} <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
                    } else {
                        updateCounts.name(usdt.username);
                    }
    
                    $('head').find('title')[0].text = `Live Twitch Follower Count for ${usdt.username}`;
                    $("#userbrand-navbar")[0].innerHTML = `<a class="navbar-brand"><img class="rounded-circle img-fluid" id="userimg-header" src="${usdt.avatar}" style="height: 50px;margin-right: 5px;" /> ${usdt.username}</a>`
                    updateCounts.pfp(usdt.avatar);
                    updateCounts.banner(usdt.userBanner);
                    hasBanner = true;
    
                    new Odometer({
                        el: document.getElementById("mainOdometer"),
                        value: usdt.followers,
                        format: '(,ddd).dd',
                    });
    
                    new Odometer({
                        el: document.getElementById("goalOdo"),
                        value: usdt.followers / 2,
                        format: '(,ddd).dd',
                    });
                    new Odometer({
                        el: document.getElementById("firstSmallOdo"),
                        value: usdt.views,
                        format: '(,ddd).dd',
                    });
                    new Odometer({
                        el: document.getElementById("secondSmallOdo"),
                        value: 0,
                        format: '(,ddd).dd',
                    });

                    updateCounts.third(usdt.streamGame);
    
                    setInterval(function () {
                        $.ajax({
                            url: `https://api-v2.nextcounts.com/api/twitch/user/${usdt.uid}`,
                            type: "GET",
                            dataType: "JSON",
                            success: function (data) {
                                updateCounts.mainCount(data.followers);
                                updateCounts.first(data.views);
                                updateCounts.goalCount(data.followers);
    
                                $(`#followersToday`)[0].outerHTML = positiveOrNegative(data.followers, oldFollowers, "followersToday");
    
                                $(`#viewsToday`)[0].outerHTML = positiveOrNegative(data.views, oldViews, "viewsToday");
                                
                                if (!firstLive[0] || !firstLive[1]) {
                                    prevCount[0] = data.followers;
                                    firstLive[0] = true;
                                    prevCount[1] = data.views;
                                    firstLive[1] = true;
                                } else {
                                    rates.add(0, data.followers - prevCount[0]);
                                    rates.add(1, data.views - prevCount[1]);
                                    prevCount[0] = data.followers;
                                    prevCount[1] = data.views;
    
                                    var avgRate1 = rates.vals[0]/2, avgRate2 = rates.vals[1]/2;
    
                                    var final11 = Math.round(avgRate1 * 60).toLocaleString();
                                    var final12 = Math.round(avgRate1 * 3600).toLocaleString();
                                    var final13 = Math.round(avgRate1 * 86400).toLocaleString();
    
                                    var final21 = Math.round(avgRate2 * 60).toLocaleString();
                                    var final22 = Math.round(avgRate2 * 3600).toLocaleString();
                                    var final23 = Math.round(avgRate2 * 86400).toLocaleString();
    
                                    updateCounts.avgs1(final11, final12, final13);
                                    updateCounts.avgs2(final21, final22, final23);
                                }
                            }, error: function () { }
                        });
                        
                        $.ajax({
                            url: `https://api-v2.nextcounts.com/api/twitch/stream/${usdt.uid}`,
                            type: "GET",
                            dataType: "JSON",
                            success: function (data) {
                                if(data.streaming == true) {
                                    $('#liveSpinner').show();
                                    updateCounts.second(data.liveViewers);
                                } else {
                                    $('#liveSpinner').hide();
                                    return;
                                }
                            }, error: function () { }
                        });
                    }, 2000);
                }
            }
        },
        error: function () { },
    });

    $.ajax(`https://statsapi.nextcounts.com/tiktokuser/${user}`)
        .done(function (stats) {
            try { JSON.parse(stats); } catch { toastr["info"](stats); };

            var ndata = JSON.parse(stats);

            oldFollowers = ndata.followers[ndata.followers.length - 1][1], oldViews = ndata.views[ndata.views.length - 1][1];

            if (ndata.followers.length > 30) {
                for (let i = 0; i < 30; i++) {
                    console.log(ndata.followers.length - (i + 1))
                    $('#tableBody').append(`<tr>
                        <td>${new Date(ndata.followers[ndata.followers.length - (i + 1)][0]).toLocaleString()}</td>
                        <td>${(ndata.followers[ndata.followers.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.followers[ndata.followers.length - (i + 1)][1], ndata.followers[ndata.followers.length - (i + 2)][1], false)}</td>
                        <td>${(ndata.views[ndata.views.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.views[ndata.views.length - (i + 1)][1], ndata.views[ndata.views.length - (i + 2)][1], false)}</td>
                    </tr>`);
                }
            } else {
                for (let i = 0; i < ndata.followers.length; i++) {
                    console.log(ndata.followers.length - (i + 1))
                    if (ndata.followers.length - (i + 1) == 0) {
                        $('#tableBody').append(`<tr>
                            <td>${new Date(ndata.followers[ndata.followers.length - (i + 1)][0]).toLocaleString()}</td>
                            <td>${(ndata.followers[ndata.followers.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.followers[ndata.followers.length - (i + 1)][1], ndata.followers[ndata.followers.length - (i + 1)][1], false)}</td>
                            <td>${(ndata.views[ndata.views.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.views[ndata.views.length - (i + 1)][1], ndata.views[ndata.views.length - (i + 1)][1], false)}</td>
                        </tr>`);
                    } else {
                        $('#tableBody').append(`<tr>
                            <td>${new Date(ndata.followers[ndata.followers.length - (i + 1)][0]).toLocaleString()}</td>
                            <td>${(ndata.followers[ndata.followers.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.followers[ndata.followers.length - (i + 1)][1], ndata.followers[ndata.followers.length - (i + 2)][1], false)}</td>
                            <td>${(ndata.views[ndata.views.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.views[ndata.views.length - (i + 1)][1], ndata.views[ndata.views.length - (i + 2)][1], false)}</td>
                        </tr>`);
                    }
                }
            }

            setTimeout(function () {
                $('#userstatsTable').DataTable();
            }, 250);
        });
}

loadDataFirstTime();

//updates the content in the page
var updateCounts = {
    name: function (name) {
        document.getElementById("username").className = document.getElementById("username").className.replace("skeleton skeleton-text", "");
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
            document.getElementById("userbanner-header").src = url;
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

        document.getElementById("goalHeader").innerHTML = `Left to ${count < 1e3 ? semifinal / 10 ** (exponent - 2) : count >= 1e3 && count < 1e4 ? semifinal / 10 ** (exponent) : count >= 1e4 && count < 1e6 ? semifinal / 10 ** (exponent - 1) : count >= 1e6 && count < 1e7 ? semifinal / 10 ** (exponent) : count >= 1e7 && count < 1e8 ? semifinal / 10 ** (exponent - 1) : count >= 1e8 && count < 1e9 ? semifinal / 10 ** (exponent - 2) : semifinal / 10 ** (exponent - 1)}${count < 1e3 ? "" : count >= 1e3 && count < 1e6 ? "k" : count >= 1e6 && count < 1e9 ? "M" : count >= 1e9 ? "B" : ""}`;

        document.getElementById("takeovertxt").innerHTML = `Time left to ${count < 1e3 ? semifinal / 10 ** (exponent - 2) : count >= 1e3 && count < 1e4 ? semifinal / 10 ** (exponent) : count >= 1e4 && count < 1e6 ? semifinal / 10 ** (exponent - 1) : count >= 1e6 && count < 1e7 ? semifinal / 10 ** (exponent) : count >= 1e7 && count < 1e8 ? semifinal / 10 ** (exponent - 1) : count >= 1e8 && count < 1e9 ? semifinal / 10 ** (exponent - 2) : semifinal / 10 ** (exponent - 1)}${count < 1e3 ? "" : count >= 1e3 && count < 1e6 ? "k" : count >= 1e6 && count < 1e9 ? "M" : count >= 1e9 ? "B" : ""}`;

        document.getElementById("goalOdo").innerHTML = final;
        
        if ((count && !isNaN(count))) {
            var gap = Math.floor(semifinal - count);
            var secsLeft = parseInt( gap / (0, rates.vals[0]) );
            $("#takeover").html(secsLeft >= 0 ? getTime(secsLeft) : "Never");
        }
    },
    first: function (count) {
        document.getElementById("firstSmallOdo").innerHTML = count;
    },
    second: function (count) {
        document.getElementById("secondSmallOdo").innerHTML = count;
    },
    third: function (count) {
        document.getElementById("thirdSmallOdo").innerHTML = count;
    },
    avgs1: function (val1, val2, val3) {
        $("#11min").html(val1);
        $("#11hour").html(val2);
        $("#124hrs").html(val3);
    },
    avgs2: function (val1, val2, val3) {
        $("#21min").html(val1);
        $("#21hour").html(val2);
        $("#224hrs").html(val3);
    },
    avgs3: function (val1, val2, val3) {
        $("#31min").html(val1);
        $("#31hour").html(val2);
        $("#324hrs").html(val3);
    },
};
