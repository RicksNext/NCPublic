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
const socialColor = "#20c997";

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
            name: "Requests",
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

//"Customize counter" Modal code
var updateChart = true;

//Loads the actual data letsgooo

var prevCount = [];
var firstLive = [false, false];
var oldFollowers = 0;
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
        url: `https://api-v2.nextcounts.com/`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (!data.requests) {
                toastr["error"](
                    "It seems like the request endpoint has been disabled. Please try again later.",
                    "Uh oh..."
                );
            } else {
                $('head').find('title')[0].text = `Live NextCounts API Requests Count`;
                updateCounts.name(`NextCounts API v2`);

                $('#openExternalBtn')[0].href = `https://api-v2.nextcounts.com/`;

                $('#smallEmbedBtn')[0].href = `https://nextcounts.com/embed/small/?p=nextcounts`;
                $('#largeEmbedBtn')[0].href = `https://nextcounts.com/embed/large/?p=nextcounts`;

                let samplePhrase = `NextCounts Live Total API Requests Count!`;
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

                new Odometer({
                    el: document.getElementById("mainOdometer"),
                    value: data.requests,
                    format: '(,ddd).dd',
                });

                new Odometer({
                    el: document.getElementById("goalOdo"),
                    value: data.requests && !isNaN(data.requests) ? data.requests / 2 : 0,
                    format: '(,ddd).dd',
                });
                new Odometer({
                    el: document.getElementById("firstSmallOdo"),
                    value: data.youtube.quota,
                    format: '(,ddd).dd',
                });

                setInterval(function () {
                    $.ajax({
                        url: `https://api-v2.nextcounts.com/`,
                        type: "GET",
                        dataType: "JSON",
                        success: function (dataa) {
                            updateCounts.mainCount(dataa.requests);
                            updateCounts.following(dataa.youtube.quota);
                            updateCounts.goalCount(dataa.requests);
                            
                            if (!firstLive[0] || !firstLive[1]) {
                                prevCount[0] = dataa.requests;
                                firstLive[0] = true;
                                prevCount[1] = dataa.youtube.quota;
                                firstLive[1] = true;
                            } else {
                                rates.add(0, dataa.requests - prevCount[0]);
                                rates.add(1, dataa.youtube.quota - prevCount[1]);
                                prevCount[0] = dataa.requests;
                                prevCount[1] = dataa.youtube.quota;

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
        if (url == "hide" || url == null || url == "") {
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
    following: function (count) {
        document.getElementById("firstSmallOdo").innerHTML = count;
    },
    videos: function (count) {
        document.getElementById("secondSmallOdo").innerHTML = count;
    },
    likes: function (count) {
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
