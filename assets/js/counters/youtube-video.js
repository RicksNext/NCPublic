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

//Stuff for the Chart & the actual chart

const textBright = "#858585";
const lineColor = "#858585";
const socialColor = "#e01227";

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

const userInURL = urlParams.get("v"), odometerInURL = urlParams.get("o");
var user = "";

!userInURL ? user = "YbJOTdZBX1g" : user = userInURL;

//"Customize counter" Modal code
var updateChart = true;
var bannerCurrent = 0;
var hasBanner = false;

//Loads the actual data letsgooo

var prevCount = [];
var firstLive = [false, false];
var oldViews = 0;
var oldLikes = 0;

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
        url: `https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.success == false) {
                toastr["error"](
                    "It seems like the video you requested doesn't exist. Please check if the @ of the user is correct.",
                    "Uh oh..."
                );
            } else {
                updateCounts.name(data.results[0].title);
                $('#openExternalBtn')[0].href = `https://youtube.com/watch?v=${user}`;

                $('#smallEmbedBtn')[0].href = `https://nextcounts.com/embed/small/?p=ytvideoviews&u=${user}`;
                $('#smallEmbedBtn-1')[0].href = `https://nextcounts.com/embed/small/?p=ytvideolikes&u=${user}`;
                $('#smallEmbedBtn-2')[0].href = `https://nextcounts.com/embed/small/?p=ytvideocomments&u=${user}`;


                $('#fbShareBtn')[0].href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=NextCounts Live YT Video View Count for ${data.results[0].title}!`;
                $('#twttrShareBtn')[0].href = `https://twitter.com/intent/tweet/?text=NextCounts Live YT Video View Count for ${data.results[0].title}! ${window.location.href} @nextcounts! `;
                $('#linkedinShareBtn')[0].href = `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=NextCounts Live YT Video View Count for ${data.results[0].title}!&summary=NextCounts Live YT Video View Count for ${data.results[0].title}!&source=${window.location.href}`;
                $('#redditShareBtn')[0].href = `https://reddit.com/submit?url=${window.location.href}&title=NextCounts Live YT Video View Count for ${data.results[0].title}!`;
                $('#wppShareBtn')[0].href = `https://api.whatsapp.com/send?text=NextCounts Live YT Video View Count for ${data.results[0].title}! ${window.location.href}`;
                $('#vkShareBtn')[0].href = `https://vk.com/share.php?url=${window.location.href}&title=NextCounts Live YT Video View Count for ${data.results[0].title}!`;
                $('#mailShareBtn')[0].href = `mailto:?subject=NextCounts Live YT Video View Count for ${data.results[0].title}!&body=NextCounts Live YT Video View Count for ${data.results[0].title}! ${window.location.href}`;
                $('#copytoClipBtn')[0].onclick = function () {
                    navigator.clipboard.writeText(window.location.href);
                    toastr["success"]("Copied to clipboard!", "Success!");
                }

                $('head').find('title')[0].text = `Live YT Video Views Count for "${data.results[0].title}"`;
                $("#userbrand-navbar")[0].innerHTML = `<a class="navbar-brand"><img class="rounded img-fluid" id="userimg-header" src="${data.results[0].thumbnails.medium.url}" style="height: 50px;margin-right: 5px;" /> ${data.results[0].title}</a>`
                updateCounts.pfp(data.results[0].thumbnails.medium.url);
                updateCounts.banner("hide");
                hasBanner = false;

                var views = parseInt(data.results[0].views), likes = parseInt(data.results[0].likes), videoid = data.results[0].videoid;
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

                new Odometer({
                    el: document.getElementById("mainOdometer"),
                    value: estViewCount,
                    format: '(,ddd).dd',
                });

                new Odometer({
                    el: document.getElementById("goalOdo"),
                    value: estViewCount / 2,
                    format: '(,ddd).dd',
                });
                new Odometer({
                    el: document.getElementById("firstSmallOdo"),
                    value: views,
                    format: '(,ddd).dd',
                });
                new Odometer({
                    el: document.getElementById("secondSmallOdo"),
                    value: likes,
                    format: '(,ddd).dd',
                });
                data.results[0].isLive == true ? $(`h5`)[3].innerHTML = `Live Viewers` : `Comments`;
                new Odometer({
                    el: document.getElementById("thirdSmallOdo"),
                    value: data.results[0].isLive == true ? data.results[0].liveViewers : data.results[0].comments,
                    format: '(,ddd).dd',
                });

                setInterval(function () {
                    $.ajax({
                        url: `https://api-v2.nextcounts.com/api/youtube/videos/stats/${videoid}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (dataa) {
                            var views = parseInt(dataa.results[0].views), likes = parseInt(dataa.results[0].likes), videoid = dataa.results[0].videoid;
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
                            updateCounts.goalCount(estViewCount);

                            dataa.results[0].isLive == true ? $(`h5`)[3].innerHTML = `Live Viewers` : `Comments`;

                            updateCounts.firstSmall(dataa.results[0].views);
                            updateCounts.secondSmall(dataa.results[0].likes);
                            updateCounts.thirdSmall(dataa.results[0].isLive == true ? dataa.results[0].liveViewers : dataa.results[0].comments);

                            $(`#followersToday`)[0].outerHTML = positiveOrNegative(estViewCount, oldViews, "followersToday");

                            $(`#likesToday`)[0].outerHTML = positiveOrNegative(likes, oldLikes, "likesToday");
                            
                            if (!firstLive[0] || !firstLive[1]) {
                                prevCount[0] = estViewCount;
                                firstLive[0] = true;
                                prevCount[1] = likes;
                                firstLive[1] = true;
                            } else {
                                rates.add(0, estViewCount - prevCount[0]);
                                rates.add(1, likes - prevCount[1]);
                                prevCount[0] = estViewCount;
                                prevCount[1] = likes;

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
                }, 2000);
            }
        },
        error: function () { },
    });

    $.ajax(`https://statsapi.nextcounts.com/youtubevideo/${user}`)
        .done(function (stats) {
            try { JSON.parse(stats); } catch { toastr["info"](stats); };

            var ndata = JSON.parse(stats);

            var viewsDiv = document.createElement('div');
            var likesDiv = document.createElement('div');
            var dislikesDiv = document.createElement('div');
            var commentsDiv = document.createElement('div');
            viewsDiv.className = likesDiv.className = dislikesDiv.className = commentsDiv.className = 'chart';
            document.getElementById('graphContainer').appendChild(viewsDiv);
            document.getElementById('graphContainer').appendChild(likesDiv);
            document.getElementById('graphContainer').appendChild(dislikesDiv);
            document.getElementById('graphContainer').appendChild(commentsDiv);
            
            Highcharts.Point.prototype.highlight = function (event) {
                event = this.series.chart.pointer.normalize(event);
                this.onMouseOver(); // Show the hover marker
                this.series.chart.tooltip.refresh(this); // Show the tooltip
                this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
            };

            Highcharts.Pointer.prototype.reset = function () {
                return undefined;
            };

            ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
                document.getElementById('graphContainer').addEventListener(
                    eventType,
                    function (e) {
                        var chart,
                            point,
                            i,
                            event;
            
                        for (i = 1; i < Highcharts.charts.length; i = i + 1) {
                            chart = Highcharts.charts[i];
                            // Find coordinates within the chart
                            event = chart.pointer.normalize(e);
                            // Get the hovered point
                            point = chart.series[0].searchPoint(event, true);
            
                            if (point) {
                                point.highlight(e);
                            }
                        }
                    }
                );
            });

            function syncExtremes(e) {
                var thisChart = this.chart;

                if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
                    Highcharts.each(Highcharts.charts, function (chart) {
                        if (chart !== thisChart) {
                            if (chart.xAxis[0].setExtremes) { // It is null while updating
                                chart.xAxis[0].setExtremes(
                                    e.min,
                                    e.max,
                                    undefined,
                                    false, {
                                        trigger: 'syncExtremes'
                                    }
                                );
                            }
                        }
                    });
                }
            }

            new Highcharts.chart(viewsDiv, {
                chart: {
                    zoomType: "x",
                    //marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                    backgroundColor: "transparent",
                    plotBorderColor: "transparent",
                },
                title: {
                    text: `Views - Historical Data`,
                    align: 'left',
                    style: {
                        color: textBright,
                    },
                    margin: 0,
                    //x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    type: "datetime",
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
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
                tooltip: {
                    positioner: function () {
                        return {
                            // right aligned
                            x: this.chart.chartWidth - this.label.width,
                            y: 10 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.y}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px',
                        color: textBright
                    }
                },
                series: [{
                    data: ndata.views,
                    marker: {
                        enabled: !1
                    },
                    name: `Views - Historical Data`,
                    type: 'spline',
                    color: socialColor,
                    fillOpacity: 0.3
                }]
            });

            new Highcharts.chart(likesDiv, {
                chart: {
                    zoomType: "x",
                    //marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                    backgroundColor: "transparent",
                    plotBorderColor: "transparent",
                },
                title: {
                    text: `Likes - Historical Data`,
                    align: 'left',
                    style: {
                        color: textBright,
                    },
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    type: "datetime",
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
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
                tooltip: {
                    positioner: function () {
                        return {
                            // right aligned
                            x: this.chart.chartWidth - this.label.width,
                            y: 10 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.y}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px',
                        color: textBright
                    }
                },
                series: [{
                    data: ndata.likes,
                    marker: {
                        enabled: !1
                    },
                    name: `Likes - Historical Data`,
                    type: 'spline',
                    color: socialColor,
                    fillOpacity: 0.3
                }]
            });

            if(ndata.dislikes) {
                new Highcharts.chart(dislikesDiv, {
                    chart: {
                        zoomType: "x",
                        //marginLeft: 40, // Keep all charts left aligned
                        spacingTop: 20,
                        spacingBottom: 20,
                        backgroundColor: "transparent",
                        plotBorderColor: "transparent",
                    },
                    title: {
                        text: `Dislikes - Historical Data`,
                        align: 'left',
                        style: {
                            color: textBright,
                        },
                        margin: 0,
                        x: 30
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        type: "datetime",
                        crosshair: true,
                        events: {
                            setExtremes: syncExtremes
                        },
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
                    tooltip: {
                        positioner: function () {
                            return {
                                // right aligned
                                x: this.chart.chartWidth - this.label.width,
                                y: 10 // align to title
                            };
                        },
                        borderWidth: 0,
                        backgroundColor: 'none',
                        pointFormat: '{point.y}',
                        headerFormat: '',
                        shadow: false,
                        style: {
                            fontSize: '18px',
                            color: textBright
                        }
                    },
                    series: [{
                        data: ndata.dislikes,
                        marker: {
                            enabled: !1
                        },
                        name: `Dislikes - Historical Data`,
                        type: 'spline',
                        color: socialColor,
                        fillOpacity: 0.3
                    }]
                });
            }

            new Highcharts.chart(commentsDiv, {
                chart: {
                    zoomType: "x",
                    //marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                    backgroundColor: "transparent",
                    plotBorderColor: "transparent",
                },
                title: {
                    text: `Comments - Historical Data`,
                    align: 'left',
                    style: {
                        color: textBright,
                    },
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    type: "datetime",
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
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
                tooltip: {
                    positioner: function () {
                        return {
                            // right aligned
                            x: this.chart.chartWidth - this.label.width,
                            y: 10 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.y}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px',
                        color: textBright
                    }
                },
                series: [{
                    data: ndata.comments,
                    marker: {
                        enabled: !1
                    },
                    name: `Comments - Historical Data`,
                    type: 'spline',
                    color: socialColor,
                    fillOpacity: 0.3
                }]
            });

            oldViews = ndata.views[ndata.views.length - 1][1], oldLikes = ndata.likes[ndata.likes.length - 1][1]

            if (ndata.views.length > 30) {
                for (let i = 0; i < 30; i++) {
                    console.log(ndata.views.length - (i + 1))
                    $('#tableBody').append(`<tr>
                        <td>${new Date(ndata.views[ndata.views.length - (i + 1)][0]).toISOString().replace('T', ' ').split('.')[0]}</td>
                        <td>${(ndata.views[ndata.views.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.views[ndata.views.length - (i + 1)][1], ndata.views[ndata.views.length - (i + 2)][1], false)}</td>
                        <td>${(ndata.likes[ndata.likes.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.likes[ndata.likes.length - (i + 1)][1], ndata.likes[ndata.likes.length - (i + 2)][1], false)}</td>
                        <td>${(ndata.comments[ndata.comments.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.comments[ndata.comments.length - (i + 1)][1], ndata.comments[ndata.comments.length - (i + 2)][1], false)}</td>
                    </tr>`);
                }
            } else {
                for (let i = 0; i < ndata.views.length; i++) {
                    console.log(ndata.views.length - (i + 1))
                    if (ndata.views.length - (i + 1) == 0) {
                        $('#tableBody').append(`<tr>
                            <td>${new Date(ndata.views[ndata.views.length - (i + 1)][0]).toISOString().replace('T', ' ').split('.')[0]}</td>
                            <td>${(ndata.views[ndata.views.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.views[ndata.views.length - (i + 1)][1], ndata.views[ndata.views.length - (i + 1)][1], false)}</td>
                            <td>${(ndata.likes[ndata.likes.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.likes[ndata.likes.length - (i + 1)][1], ndata.likes[ndata.likes.length - (i + 1)][1], false)}</td>
                            <td>${(ndata.comments[ndata.comments.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.comments[ndata.comments.length - (i + 1)][1], ndata.comments[ndata.comments.length - (i + 1)][1], false)}</td>
                        </tr>`);
                    } else {
                        $('#tableBody').append(`<tr>
                            <td>${new Date(ndata.views[ndata.views.length - (i + 1)][0]).toISOString().replace('T', ' ').split('.')[0]}</td>
                            <td>${(ndata.views[ndata.views.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.views[ndata.views.length - (i + 1)][1], ndata.views[ndata.views.length - (i + 2)][1], false)}</td>
                            <td>${(ndata.likes[ndata.likes.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.likes[ndata.likes.length - (i + 1)][1], ndata.likes[ndata.likes.length - (i + 2)][1], false)}</td>
                            <td>${(ndata.comments[ndata.comments.length - (i + 1)][1]).toLocaleString()} ${higherLowerOrEqual(ndata.comments[ndata.comments.length - (i + 1)][1], ndata.comments[ndata.comments.length - (i + 2)][1], false)}</td>
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

        document.getElementById("goalHeader").innerHTML = document.getElementById("takeovertxt").innerHTML = `Left to ${abbreviateGivenNumber(semifinal)}`;

        document.getElementById("goalOdo").innerHTML = final;
        
        if ((count && !isNaN(count))) {
            var gap = Math.floor(semifinal - count);
            var secsLeft = parseInt( gap / (0, rates.vals[0]) );
            $("#takeover").html(secsLeft >= 0 ? getTime(secsLeft) : "Never");
            $('#progressSoFar')[0].innerHTML = $('#progressSoFar')[0].style.width = `${(count / semifinal) * 100}%`;
            $('#progressSoFar')[0].ariaValueNow = count / semifinal * 100;
        }
    },
    firstSmall: function (count) {
        document.getElementById("firstSmallOdo").innerHTML = count;
    },
    secondSmall: function (count) {
        document.getElementById("secondSmallOdo").innerHTML = count;
    },
    thirdSmall: function (count) {
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
};
