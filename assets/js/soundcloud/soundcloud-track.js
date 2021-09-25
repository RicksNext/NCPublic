//Stuff for the Chart & the actual chart

const textBright = "#F0F0F3";
const lineColor = "#707073";
const socialColor = "#ff9900";
const maxPoints = 900;

const chart = new Highcharts.chart({
  chart: {
      renderTo: 'chart',
      type: 'spline',
        zoomType: 'x',
        backgroundColor: 'transparent',
        plotBorderColor: 'transparent'
  },
  title: {
      text: ''
  },
  xAxis: {
      type: 'datetime',
      tickPixelInterval: 500,
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright
            }
        },
        lineColor: lineColor,
        minorGridLineColor: '#505053',
        tickColor: lineColor,
        title: {
            style: {
                color: textBright
            }
        }
  },
  yAxis: {
      title: {
          text: ''
      },
        gridLineColor: lineColor,
        labels: {
            style: {
                color: textBright
            }
        },
        lineColor: lineColor,
        minorGridLineColor: '#505053',
        tickColor: lineColor
  },
  credits: {
      enabled: true,
      text: "NextCounts",
      href: "https://nextcounts.com"
  },

  series: [{
    showInLegend: false,
     name: 'Plays',
    marker: { enabled: false },
    color: socialColor,
    lineColor: socialColor
  }]
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

const userInURL = urlParams.get('u');
const odometerInURL = urlParams.get('o');

if (!userInURL) {
    user = "315927043";
} else {
    user = userInURL;
}

if(!odometerInURL || odometerInURL == 0 || odometerInURL == "normal") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">');
}
if (odometerInURL == "1" || odometerInURL == "fast") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast.css">');
}
if (odometerInURL == "2" || odometerInURL == "ncolored") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-colored.css">');
}
if (odometerInURL == "3" || odometerInURL == "fcolored") {
    $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast-colored.css">');
}

//"Customize counter" Modal code
var updateChart = true;
var bannerCurrent = 1;
var hasBanner = true;

$("#applyChangesCustomize").click(function(){
    //Odometer customizer
    if(odometerSelector.value == 'fast') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast.css">');
    } else if (odometerSelector.value == 'ncolored') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-colored.css">');
    } else if (odometerSelector.value == 'fcolored') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer-fast-colored.css">');
    } else if (odometerSelector.value == 'normal') {
        $('link#odometerCSS').remove();
        $('head').append('<link rel="stylesheet" type="text/css" id="odometerCSS" href="https://nextcounts.com/assets/css/global/odometer.css">');
    }

    //chart on/off switch
    if(disableChart.checked) {
        chart.series[0].setData([]);
        updateChart = false;
        document.getElementById("chart").style.display = "none";
    }

    if(!disableChart.checked && updateChart == false){
        document.getElementById("chart").style.display = "block";
        updateChart = true;
    }
});

//Search for user - "Basic" Edition (Noice edition got cancelled, oof)
document.getElementById("searchBar").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchForUser();
    }
});

$("#searchBtn").click(function(){
	searchForUser();
});

function searchForUser() {
    var searchTerm = searchBar.value.replace("@", "");
    
    $.ajax({
        url: `https://api.nextcounts.com/api/soundcloud/track/search/${searchTerm}`,
        type: "GET",
        dataType: "JSON",
        success: function(data){
            if(data.error) {
                searchUsername.innerHTML = "Track not found.";
                searchBottomtext.innerHTML = "Please check if the spelling is correct and try again.";
            } else {
                searchUsername.innerHTML = data.title;
                searchPfp.src = data.artwork;
                searchBottomtext.innerHTML = `${(data.plays).toLocaleString()} Plays`;
                searchUsername.title = data.trackid;
                searchUserBox.style.cursor = `pointer`;
            }
        },
        error: function(){
            searchUsername.innerHTML = "Our API seems to be down right now.";
            searchBottomtext.innerHTML = "Please try again later.";
        }
    });
}

//Loads the actual data letsgooo
$('head').find('title')[0].text = `Live Soundcloud Track Plays count`;
function loadDataFirstTime() {
    
    $.ajax({
        url: `https://api.nextcounts.com/api/soundcloud/track/${user}`,
        type: "GET",
        dataType: "JSON",
        success: function(data){
            if(data.error) {
                toastr.options = {
                    "closeButton": true,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": true,
                    "positionClass": "toast-top-left",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1500",
                    "timeOut": "7000",
                    "extendedTimeOut": "2500",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                
                toastr["error"]("It seems like the user you requested doesn't exist. Please check if the @ of the user is correct.", "Uh oh...");
            } else {
                $('head').find('title')[0].text = `Live Soundcloud Track Plays Count for "${data.title}"`;
                updateCounts.name(data.title);
                updateCounts.pfp(data.artwork);
                updateCounts.banner("hide");
                hasBanner = false;
                updateCounts.mainCount(data.plays);

                updateCounts.likes(data.likes);
                updateCounts.reposts(data.reposts);
                updateCounts.comments(data.comments);
                
                setInterval(function() {
                    $.ajax({
                        url: `https://api.nextcounts.com/api/soundcloud/track/${user}`,
                        type: "GET",
                        dataType: "JSON",
                        success: function(data){
                            if(data.error) {
                                return;
                            } else {
                                updateCounts.mainCount(data.plays);
                    
                                updateCounts.likes(data.likes);
                                updateCounts.reposts(data.reposts);
                                updateCounts.comments(data.comments);
                            }
                        }
                    });
                }, 2000);
            }
        },
        error: function(){
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-left",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1500",
                "timeOut": "7000",
                "extendedTimeOut": "2500",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            
            toastr["error"]("It seems like our system is currently down for some unknown reason. Please message us on Twitter (@NextCounts) so we can quickly fix this issue.", "Uh oh...");
        }
    });
}

loadDataFirstTime();

//updates the content in the page
var updateCounts = {
    name: function(name) {
        document.getElementById('username').innerHTML = name;
    },
    pfp: function(url) {
        document.getElementById('userImg').src = url;
    },
    banner: function(url) {
        if(url == "hide") {
            document.getElementById('userBanner').style.opacity = `0`;
            document.getElementById('userImg').style.marginTop = `-80px`;
        } else {
            document.getElementById('userBanner').src = url;
        }
    },
    mainCount: function(count) {
        if(count >= 1) {
            document.getElementById('mainOdometer').innerHTML = count;
            
            if(updateChart == true) {
                if (chart.series[0].points.length >= maxPoints) {
                    chart.series[0].data[0].remove();
                }
                chart.series[0].addPoint([calcTime(), count]);
            }
        }
    },
    likes: function(count) {
        document.getElementById('likesOdo').innerHTML = count;
    },
    reposts: function(count) {
        document.getElementById('repostsOdo').innerHTML = count;
    },
    comments: function(count) {
        document.getElementById('commentsOdo').innerHTML = count;
    }
}