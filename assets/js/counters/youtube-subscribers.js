/*
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
*/

//Stuff for the Chart & the actual chart

const textBright = "#858585";
const lineColor = "#858585";
const socialColor = "#e01227";

// Common chart configuration for styling consistency
const chartConfig = {
    chart: {
        type: "spline",
        zoomType: "x",
        backgroundColor: "transparent",
        plotBorderColor: "transparent",
        style: {
            fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        },
        spacing: [20, 10, 20, 10],
        borderRadius: 8,
        animation: {
            duration: 1250,
            easing: 'easeOutBounce'
        }
    },
    title: {
        text: null, // Remove chart titles
        style: {
            color: textBright,
            fontSize: '18px',
            fontWeight: 'bold'
        },
        align: 'left',
        margin: 20
    },
    xAxis: {
        type: "datetime",
        tickPixelInterval: 200,
        gridLineColor: lineColor,
        gridLineWidth: 0.3,
        labels: {
            style: {
                color: textBright,
                fontSize: '12px'
            }
        },
        lineColor: lineColor,
        minorGridLineColor: "#858585",
        tickColor: lineColor,
        title: {
            style: {
                color: textBright
            }
        },
        crosshair: {
            color: socialColor,
            dashStyle: 'solid',
            width: 1,
            label: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderRadius: 5,
                padding: 8
            }
        }
    },
    yAxis: {
        title: {
            text: "",
        },
        gridLineColor: lineColor,
        gridLineWidth: 0.3,
        labels: {
            style: {
                color: textBright,
                fontSize: '12px'
            },
            formatter: function() {
                return this.value >= 1000000 ? (this.value / 1000000).toFixed(2) + 'M' : 
                       this.value >= 1000 ? (this.value / 1000).toFixed(2) + 'K' : this.value;
            }
        },
        lineColor: lineColor,
        minorGridLineColor: "#505053",
        tickColor: lineColor
    },
    credits: {
        enabled: true,
        text: "NextCounts",
        href: "https://nextcounts.com",
        style: {
            color: textBright,
            fontSize: '10px'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        style: {
            color: '#F0F0F0',
            fontSize: '13px'
        },
        borderWidth: 0,
        borderRadius: 8,
        shadow: true,
        shared: true,
        valueDecimals: 0,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        headerFormat: '<span style="font-size: 14px; font-weight: bold">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>'
    },
    plotOptions: {
        areaspline: {
            lineWidth: 2,
            states: {
                hover: {
                    lineWidth: 3
                }
            },
            marker: {
                enabled: false,
                radius: 4,
                fillColor: socialColor,
                lineColor: '#FFFFFF',
                lineWidth: 1,
                states: {
                    hover: {
                        enabled: true,
                        radius: 6
                    }
                }
            },
            fillOpacity: 0.2,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, socialColor],
                    [1, 'rgba(224, 18, 39, 0.05)']
                ]
            }
        },
        series: {
            animation: {
                duration: 1000
            }
        }
    },
    exporting: {
        enabled: true,
        fallbackToExportServer: false, // Process export on client side only
        buttons: {
            contextButton: {
                menuItems: [
                    {
                        text: 'Download CSV',
                        onclick: function() {
                            this.downloadCSV();
                        }
                    },
                    {
                        text: 'Download JPG',
                        onclick: function() {
                            this.exportChart({
                                type: 'image/jpeg',
                                filename: this.title.textStr.replace(/ /g, '_').toLowerCase()
                            });
                        }
                    }
                ],
                symbol: 'menu',
                symbolFill: socialColor,
                symbolStroke: socialColor,
                theme: {
                    fill: 'transparent',
                    stroke: 'transparent',
                    states: {
                        hover: {
                            fill: 'rgba(0, 0, 0, 0.2)'
                        },
                        select: {
                            fill: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    r: 8
                },
                // Make sure the button is visible
                align: 'right',
                verticalAlign: 'top',
                enabled: true
            }
        },
        // Style the dropdown menu to match theme
        menuItemStyle: {
            backgroundColor: 'transparent',
            color: textBright,
            fontSize: '14px',
            padding: '10px'
        },
        menuItemHoverStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: '#FFFFFF'
        },
        csv: {
            dateFormat: '%Y-%m-%d %H:%M:%S',
            columnHeaderFormatter: function(item) {
                if (item instanceof Highcharts.Axis) {
                    return 'Date';
                } else {
                    return item.name || 'Value';
                }
            }
        },
        filename: function() {
            return this.title.textStr.replace(/ /g, '_').toLowerCase();
        }
    }
};

// Create the main live chart with the unified styling
const chart = new Highcharts.chart(Object.assign({}, chartConfig, {
    chart: Object.assign({}, chartConfig.chart, {
        renderTo: "mainchart"
    }),
    title: {
        text: null, // Remove title from live chart
    },
    // For the live chart, we'll use a simpler export menu
    exporting: {
        enabled: true,
        buttons: {
            contextButton: {
                menuItems: ['downloadCSV', 'downloadJPEG'],
                symbol: 'menu',
                symbolFill: socialColor,
                symbolStroke: socialColor,
                theme: {
                    fill: 'transparent',
                    stroke: 'transparent',
                    states: {
                        hover: {
                            fill: 'rgba(0, 0, 0, 0.2)'
                        },
                        select: {
                            fill: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    r: 8
                }
            }
        }
    },
    series: [
        {
            showInLegend: false,
            name: "Subscribers",
            marker: { enabled: false },
            color: socialColor,
            lineColor: socialColor,
            fillOpacity: 0.2,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, socialColor],
                    [1, 'rgba(224, 18, 39, 0.05)']
                ]
            }
        },
    ],
}));

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

!userInURL ? user = "UCL-t6GiYdYgOgDdFVVx5G0w" : user = userInURL;

//"Customize counter" Modal code
var updateChart = true;
var bannerCurrent = 1;
var hasBanner = true;

//Loads the actual data letsgooo

var prevCount = [];
var firstLive = [false, false];
var oldFollowers = 0;
var oldViews = 0;

var rates = {
    counts: [[], [], []],
    vals: [0, 0, 0],
    divisor: [0, 0, 0],
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

var abbreviated = true;

function loadDataFirstTime() {
    $.ajax({
        url: `https://api-v2.nextcounts.com/api/youtube/channel/${user}`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.error) {
                toastr["error"](
                    "It seems like the user you requested doesn't exist. Please check if the @ of the user is correct.",
                    "Uh oh..."
                );
            } else {
                if(data.abbreviated == false && data.verifiedSubCount && data.verifiedSubCount == true) {
                    updateCounts.name(`${data.username} <i class="far fa-check-circle" data-toggle="tooltip" title="Verified SubCount">`);
                } else {
                    updateCounts.name(data.username);
                }
                $('#openExternalBtn')[0].href = `https://youtube.com/channel/${user}`;

                $('#smallEmbedBtn')[0].href = `https://nextcounts.com/embed/small/?p=ytsubcount&u=${user}`;
                $('#smallEmbedBtn-1')[0].href = `https://nextcounts.com/embed/small/?p=ytsubcountmixerno&u=${user}`;
                $('#smallEmbedBtn-2')[0].href = `https://nextcounts.com/embed/small/?p=ytviewcount&u=${user}`;

                $('#largeEmbedBtn')[0].href = `https://nextcounts.com/embed/large/?p=ytsubcount&u=${user}`;
                $('#largeEmbedBtn-1')[0].href = `https://nextcounts.com/embed/large/?p=ytsubcountmixerno&u=${user}`;
                $('#largeEmbedBtn-2')[0].href = `https://nextcounts.com/embed/large/?p=ytviewcount&u=${user}`;

                let samplePhrase = `NextCounts Live YouTube Subscriber Count for ${data.username}!`;
                $('#fbShareBtn')[0].href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${samplePhrase}`;
                $('#twttrShareBtn')[0].href = `https://twitter.com/intent/tweet/?text=${samplePhrase} ${window.location.href} @nextcounts! `;
                $('#linkedinShareBtn')[0].href = `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${samplePhrase}&summary=${samplePhrase}&source=${window.location.href}`;
                $('#redditShareBtn')[0].href = `https://reddit.com/submit?url=${window.location.href}&title=${samplePhrase}`;
                $('#wppShareBtn')[0].href = `https://api.whatsapp.com/send?text=${samplePhrase} ${window.location.href}`;
                $('#vkShareBtn')[0].href = `https://vk.com/share.php?url=${window.location.href}&title=${samplePhrase}`;
                $('#mailShareBtn')[0].href = `mailto:?subject=${samplePhrase}&body=${samplePhrase} ${window.location.href}`;
                $('#copytoClipBtn')[0].onclick = function () {
                    navigator.clipboard.writeText(window.location.href);
                    toastr["success"]("Copied to clipboard!", "Success!");
                }

                $('head').find('title')[0].text = `Live YouTube Subscriber Count for ${data.username}`;
                $("#userbrand-navbar")[0].innerHTML = `<a class="navbar-brand"><img class="rounded-circle img-fluid" id="userimg-header" src="${data.userImg}" style="height: 50px;margin-right: 5px;" /> ${data.username}</a>`
                updateCounts.pfp(data.userImg);
                updateCounts.banner(data.userBanner);
                hasBanner = true;

                abbreviated = data.subcount >= 50000 && data.abbreviated === true;

                if(abbreviated) {
                    $.ajax({
                        url: `https://api-v2.nextcounts.com/api/youtube/channel/estimate/mixerno/${user}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (dataa) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: dataa.estimatedSubCount,
                                format: '(,ddd).dd',
                            });

                            new Odometer({
                                el: document.getElementById("goalOdo"),
                                value: !isNaN(dataa.estimatedSubCount) ? dataa.estimatedSubCount / 2 : 0,
                                format: '(,ddd).dd',
                            });

                            new Odometer({
                                el: document.getElementById("followingOdo"),
                                value: data.subcount,
                                format: '(,ddd).dd',
                            });
                            $('h5')[1].innerHTML = "Subscribers (API)";
                            
                            new Odometer({
                                el: document.getElementById("likesOdo"),
                                value: dataa.totalViews,
                                format: '(,ddd).dd',
                            });
                            $('h5')[3].innerHTML = "Views (Estimated)";
                        }, error: function () { }
                    });
                } else {
                    new Odometer({
                        el: document.getElementById("mainOdometer"),
                        value: data.subcount,
                        format: '(,ddd).dd',
                    });
    
                    new Odometer({
                        el: document.getElementById("goalOdo"),
                        value: !isNaN(data.subcount) ? data.subcount / 2 : 0,
                        format: '(,ddd).dd',
                    });

                    new Odometer({
                        el: document.getElementById("followingOdo"),
                        value: data.subcount,
                        format: '(,ddd).dd',
                    });
                    $('h5')[1].innerHTML = "Subscribers (API)";

                    new Odometer({
                        el: document.getElementById("likesOdo"),
                        value: data.likes,
                        format: '(,ddd).dd',
                    });
                    $('h5')[3].innerHTML = "Views (API)";
                }

                new Odometer({
                    el: document.getElementById("tweetsOdo"),
                    value: data.videos,
                    format: '(,ddd).dd',
                });

                setInterval(function () {
                    $.ajax({
                        url: `https://api-v2.nextcounts.com/api/youtube/channel/${user}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (dataa) {
                            if(dataa.subcount < 50000 || dataa.abbreviated == false) {
                                abbreviated = false;
                                $('h5')[1].innerHTML = "Subscribers (Estimate)";
                                $('h5')[3].innerHTML = "Views (API)";
                                $('strong')[0].innerHTML = "Live Subscribers Count (API)";

                                updateCounts.mainCount(dataa.subcount);
                                updateCounts.videos(dataa.videos);
                                updateCounts.views(dataa.viewcount);
                                updateCounts.goalCount(dataa.subcount);
    
                                $(`#followersToday`)[0].outerHTML = positiveOrNegative(dataa.subcount, oldFollowers, "followersToday");
    
                                $(`#tweetsToday`)[0].outerHTML = positiveOrNegative(dataa.viewcount, oldViews, "tweetsToday");
                                
                                if (!firstLive[0] || !firstLive[1]) {
                                    prevCount[0] = dataa.subcount;
                                    firstLive[0] = true;
                                    prevCount[1] = dataa.viewcount;
                                    firstLive[1] = true;
                                } else {
                                    rates.add(0, dataa.subcount - prevCount[0]);
                                    rates.add(1, dataa.viewcount - prevCount[1]);
                                    prevCount[0] = dataa.subcount;
                                    prevCount[1] = dataa.viewcount;
    
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
                            } else {
                                updateCounts.subsecond(dataa.subcount);
                            }
                        }, error: function () { }
                    });

                    $.ajax({
                        url: `https://api-v2.nextcounts.com/api/youtube/channel/estimate/mixerno/${user}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (dataa) {
                            if(dataa.estimatedSubCount >= 50000 && abbreviated === true) {
                                $('h5')[1].innerHTML = "Subscribers (API)";
                                $('h5')[3].innerHTML = "Views (Estimate)";
                                $('strong')[0].innerHTML = "Live Subscribers Count (Estimated)";

                                updateCounts.mainCount(dataa.estimatedSubCount);
                                updateCounts.videos(dataa.videos);
                                updateCounts.views(dataa.totalViews);
                                updateCounts.goalCount(dataa.estimatedSubCount);
    
                                $(`#followersToday`)[0].outerHTML = positiveOrNegative(dataa.estimatedSubCount, oldFollowers, "followersToday");
    
                                $(`#tweetsToday`)[0].outerHTML = positiveOrNegative(dataa.totalViews, oldViews, "tweetsToday");
                                
                                if (!firstLive[0] || !firstLive[1]) {
                                    prevCount[0] = dataa.estimatedSubCount;
                                    firstLive[0] = true;
                                    prevCount[1] = dataa.totalViews;
                                    firstLive[1] = true;
                                } else {
                                    rates.add(0, dataa.estimatedSubCount - prevCount[0]);
                                    rates.add(1, dataa.totalViews - prevCount[1]);
                                    prevCount[0] = dataa.estimatedSubCount;
                                    prevCount[1] = dataa.totalViews;
    
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
                            } else {
                                updateCounts.subsecond(dataa.estimatedSubCount);
                            }
                        }, error: function () { }
                    });
                }, 2000);
            }
        },
        error: function () { },
    });

    $.ajax(`https://api-v2.nextcounts.com/api/stats/youtubeuser/${user}`)
        .done(function (ndata) {
            //try { JSON.parse(stats); } catch { toastr["info"](stats); };
            //var ndata = JSON.parse(stats);

            new Highcharts.chart(Object.assign({}, chartConfig, {
                chart: Object.assign({}, chartConfig.chart, {
                    renderTo: 'fullsubschart'
                }),
                title: {
                    text: null, // Remove title
                },
                series: [{
                    data: ndata.ytapi.subscribers,
                    name: `Subscribers (API)`,
                    color: socialColor,
                    fillOpacity: 0.2,
                    area: true
                }],
                exporting: Object.assign({}, chartConfig.exporting, {
                    filename: 'youtube_subscribers_api_history'
                })
            }));

            new Highcharts.chart(Object.assign({}, chartConfig, {
                chart: Object.assign({}, chartConfig.chart, {
                    renderTo: 'estsubchart'
                }),
                title: {
                    text: null, // Remove title
                },
                series: [{
                    data: ndata.estimated.subscribers,
                    name: `Subscribers (Estimates)`,
                    color: socialColor,
                    fillOpacity: 0.2,
                    area: true
                }],
                exporting: Object.assign({}, chartConfig.exporting, {
                    filename: 'youtube_subscribers_estimates_history'
                })
            }));

            new Highcharts.chart(Object.assign({}, chartConfig, {
                chart: Object.assign({}, chartConfig.chart, {
                    renderTo: 'allviewschart'
                }),
                title: {
                    text: null, // Remove title
                },
                series: [{
                    data: ndata.ytapi.views,
                    name: `Views`,
                    color: socialColor,
                    fillOpacity: 0.2,
                    area: true
                }],
                exporting: Object.assign({}, chartConfig.exporting, {
                    filename: 'youtube_views_history'
                })
            }));

            new Highcharts.chart(Object.assign({}, chartConfig, {
                chart: Object.assign({}, chartConfig.chart, {
                    renderTo: 'allvideoschart'
                }),
                title: {
                    text: null, // Remove title
                },
                series: [{
                    data: ndata.ytapi.videos,
                    name: `Videos`,
                    color: socialColor,
                    fillOpacity: 0.2,
                    area: true
                }],
                exporting: Object.assign({}, chartConfig.exporting, {
                    filename: 'youtube_videos_history'
                })
            }));

            if(ndata.ytapi.subscribers[0][1] >= 10000) {
                oldFollowers = ndata.estimated.subscribers[ndata.estimated.subscribers.length - 1][1];
            } else {
                oldFollowers = ndata.ytapi.subscribers[ndata.ytapi.subscribers.length - 1][1];
            }

            oldViews = ndata.ytapi.views[ndata.ytapi.views.length - 1][1];

            // Create a unified timeline of all timestamps across all datasets
            let allTimestamps = new Set();
            
            // Collect all timestamps from all datasets
            ndata.ytapi.subscribers.forEach(item => allTimestamps.add(item[0]));
            ndata.estimated.subscribers.forEach(item => allTimestamps.add(item[0]));
            ndata.ytapi.views.forEach(item => allTimestamps.add(item[0]));
            ndata.ytapi.videos.forEach(item => allTimestamps.add(item[0]));
            
            // Convert to array and sort in descending order (newest first)
            let sortedTimestamps = Array.from(allTimestamps).sort((a, b) => b - a);
            
            // Create lookup maps for each dataset for quick access
            let apiSubsMap = new Map(ndata.ytapi.subscribers.map(item => [item[0], item[1]]));
            let estSubsMap = new Map(ndata.estimated.subscribers.map(item => [item[0], item[1]]));
            let viewsMap = new Map(ndata.ytapi.views.map(item => [item[0], item[1]]));
            let videosMap = new Map(ndata.ytapi.videos.map(item => [item[0], item[1]]));
            
            // Clear existing table data
            $('#tableBody').empty();
            
            // Populate table with all data points
            sortedTimestamps.forEach((timestamp, index) => {
                // Get values for this timestamp
                let estSubs = estSubsMap.get(timestamp);
                let apiSubs = apiSubsMap.get(timestamp);
                let views = viewsMap.get(timestamp);
                let videos = videosMap.get(timestamp);
                
                // Get previous timestamp for comparison (if it exists)
                let prevTimestamp = sortedTimestamps[index + 1];
                
                // Format the date
                let dateStr = new Date(timestamp).toISOString().replace('T', ' ').split('.')[0];
                
                // Build table row
                let row = `<tr><td>${dateStr}</td>`;
                
                // Add estimated subscribers with comparison
                if (estSubs !== undefined) {
                    let prevEstSubs = prevTimestamp ? estSubsMap.get(prevTimestamp) : undefined;
                    row += `<td>${estSubs.toLocaleString()} ${prevEstSubs !== undefined ? higherLowerOrEqual(estSubs, prevEstSubs, false) : ''}</td>`;
                } else {
                    row += `<td>---</td>`;
                }
                
                // Add API subscribers with comparison
                if (apiSubs !== undefined) {
                    let prevApiSubs = prevTimestamp ? apiSubsMap.get(prevTimestamp) : undefined;
                    row += `<td>${apiSubs.toLocaleString()} ${prevApiSubs !== undefined ? higherLowerOrEqual(apiSubs, prevApiSubs, false) : ''}</td>`;
                } else {
                    row += `<td>---</td>`;
                }
                
                // Add views with comparison
                if (views !== undefined) {
                    let prevViews = prevTimestamp ? viewsMap.get(prevTimestamp) : undefined;
                    row += `<td>${views.toLocaleString()} ${prevViews !== undefined ? higherLowerOrEqual(views, prevViews, false) : ''}</td>`;
                } else {
                    row += `<td>---</td>`;
                }
                
                // Add videos with comparison
                if (videos !== undefined) {
                    let prevVideos = prevTimestamp ? videosMap.get(prevTimestamp) : undefined;
                    row += `<td>${videos.toLocaleString()} ${prevVideos !== undefined ? higherLowerOrEqual(videos, prevVideos, false) : ''}</td>`;
                } else {
                    row += `<td>---</td>`;
                }
                
                row += `</tr>`;
                $('#tableBody').append(row);
            });

            // Initialize DataTable immediately with sorting by date (newest first)
            $('#userstatsTable').DataTable({
                "order": [[0, "desc"]], // Sort by first column (date) in descending order
                "pageLength": 25,       // Show 25 entries per page
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "language": {
                    "search": "Search records:",
                    "lengthMenu": "Show _MENU_ records per page",
                    "info": "Showing _START_ to _END_ of _TOTAL_ records"
                },
                "responsive": true,
                "processing": true
            });
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
    subsecond: function (count) {
        document.getElementById("followingOdo").innerHTML = count;
    },
    videos: function (count) {
        document.getElementById("tweetsOdo").innerHTML = count;
    },
    views: function (count) {
        document.getElementById("likesOdo").innerHTML = count;
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
