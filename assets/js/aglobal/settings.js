window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-R34Z4R4SVB');


var maxPoints = 900;

if(localStorage.getItem("insiderMode") && localStorage.getItem("insiderMode") == 'true') {
    $('#themeSelector').append(
        `<optgroup label="Select your theme">
            <option value="white" selected>White (Default)</option>
            <option value="dark">Darker</option>
            <option value="amoled">AMOLED Theme (Insider Exclusive - BETA)</option>
        </optgroup>`
    );
    $('#insidercomparegroup').show();
	$('.badge')[0].innerHTML = `v3.1 BETA`;
} else {
    $('#themeSelector').append(
        `<optgroup label="Select your theme">
            <option value="white" selected>White (Default)</option>
            <option value="dark">Darker</option>
        </optgroup>`
    );
	$('.badge')[0].innerHTML = `v3.0.1`;
}

$('#graphTimer').append(
    `<optgroup label="Real-Time graph can show:">
        <option value="7">15 Seconds</option>
        <option value="30">1 Minute</option>
        <option value="900" selected>30 Minutes (Default)</option>
        <option value="1800">1 Hour</option>
        <option value="3600">2 Hours</option>
        <option value="5400">3 Hours</option>
        <option value="2147483647">No Limit (Might cause lag after a while)</option>
    </optgroup>`
);

if(window.location.pathname == '/') {
    $(`#chartGraphGlobalSwitch`).hide();
    $(`#chartGraphSingleSwitch`).hide();
    $(`#graphLimitSettingForm`).hide();
    $(`#settingsVisualDisclaimer`).show();
} else {
    $(`#settingsVisualDisclaimer`).hide();
}

if(window.location.pathname.includes('compare')) {
    $(`#chartDisableUsersGraphSwitch`).show();
} else {
    $(`#chartDisableUsersGraphSwitch`).hide();
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-left",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

if(localStorage.getItem("graphlimit") == null || localStorage.getItem("graphlimit") == "") {
    localStorage.setItem("graphlimit", "900");
} else {
    $('#graphTimer')[0].value = localStorage.getItem("graphlimit");
    maxPoints = Math.floor(localStorage.getItem("graphlimit"));
}

$('#graphTimer').change(function(){
    localStorage.setItem("graphlimit", $('#graphTimer')[0].value);
    maxPoints = Math.floor($('#graphTimer')[0].value);
    console.log($('#graphTimer').val());

    if(chart.series[0].points.length > $('#graphTimer').val()) {
        for (let i = $('#graphTimer').val(); $('#graphTimer').val() <= chart.series[0].points.length; i++) {
            chart.series[0].data[0].remove();
        }
    }
});




if(localStorage.getItem("theme") == null || localStorage.getItem("theme") == "") {
    localStorage.setItem("theme", "white");
} else {
    switch(localStorage.getItem("theme")) {
        case "dark": {
            $('html')[0].className = 'darktheme';
            $('body')[0].className = 'darktheme';
            $('#themeSelector')[0].value = `dark`;
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-light`, ` navbar-dark`);
            break;
        }
        case "amoled": {
            $('html')[0].className = 'amoledtheme';
            $('body')[0].className = 'amoledtheme';
            $('#themeSelector')[0].value = `amoled`;
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-light`, ` navbar-dark`);
            break;
        }
        default: {
            $('html')[0].className = 'whitetheme';
            $('body')[0].className = 'whitetheme';
            $('#themeSelector')[0].value = `white`;
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-dark`, ` navbar-light`);
            break;
        }
    }
}

if(localStorage.getItem("globalChart") == null || localStorage.getItem("globalChart") == "") {
    localStorage.setItem("globalChart", "true");
} else {
    switch(localStorage.getItem("globalChart")) {
        case "false": {
            setTimeout(function() {
                chart.series[0].setData([]);
                updateChart = false;
                $('#chartCard').hide();
                document.getElementById("disableChartGlobal").checked = true;
                document.getElementById("disableThisChart").checked = true;
            }, 100);
            break;
        }
        default: {
            setTimeout(function() {
                updateChart = true;
                $('#chartCard').show();
                document.getElementById("disableChartGlobal").checked = false;
            }, 100);
            break;
        }
    }
}

$('#themeSelector').change(function(){
    switch($('#themeSelector').val()) {
        case `dark`: {
            localStorage.setItem("theme", "dark");
            $('html')[0].className = 'darktheme';
            $('body')[0].className = 'darktheme';
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-light`, ` navbar-dark`);
            break;
        }
        case `amoled`: {
            localStorage.setItem("theme", "amoled");
            $('html')[0].className = 'amoledtheme';
            $('body')[0].className = 'amoledtheme';
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-light`, ` navbar-dark`);
            break;
        }
        default: {
            localStorage.setItem("theme", "white");
            $('html')[0].className = 'whitetheme';
            $('body')[0].className = 'whitetheme';
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-dark`, ` navbar-light`);
            break;
        }
    }
    console.log($('#themeSelector').val());
});

document.getElementById("disableChartGlobal").addEventListener('change', function() {
    if (this.checked) {
        localStorage.setItem("globalChart", "false");
        chart.series[0].setData([]);
        updateChart = false;
        $('#chartCard').hide();
        document.getElementById("disableThisChart").checked = true;
    } else {
        localStorage.setItem("globalChart", "true");
        updateChart = true;
        $('#chartCard').show();
        document.getElementById("disableThisChart").checked = false;
    }
});

document.getElementById("disableThisChart").addEventListener('change', function() {
    if (this.checked) {
        chart.series[0].setData([]);
        $('#chartCard').hide();
        updateChart = false;
    } else {
        updateChart = true;
        $('#chartCard').show();
    }
});

document.getElementById("disableUsersChart").addEventListener('change', function() {
    if (this.checked) {
        charts[0].series[0].setData([]);
        charts[1].series[0].setData([]);
        $('#chartCard').hide();
        updateUsersChart = false;
    } else {
        updateUsersChart = true;
        $('#chartCard').show();
    }
});

//insider mode code

// a key map of allowed keys
var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b'
};

var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

var konamiCodePosition = 0;

document.addEventListener('keydown', function (e) {
    var key = allowedKeys[e.keyCode];
    var requiredKey = konamiCode[konamiCodePosition];

    if (key == requiredKey) {
        konamiCodePosition++;

        if (konamiCodePosition == konamiCode.length) {
            activateCheats();
            konamiCodePosition = 0;
        }
    } else {
        konamiCodePosition = 0;
    }
});

function activateCheats() {
    if(localStorage.getItem("insiderMode") && localStorage.getItem("insiderMode") == 'true') {
        var audio = new Audio('http://nextcounts.com/assets/logoff.mp3');
        audio.play();

        localStorage.setItem("insiderMode", 'false');
		setTimeout(function(){
			alert(`Insider Mode has been disabled!
You need to refresh the page to disable Insider exclusive features. Don't tell anyone how you did this.`);
		},20);
    } else {
        var audio = new Audio('http://nextcounts.com/assets/logon.mp3');
        audio.play();

        localStorage.setItem("insiderMode", 'true');
		setTimeout(function(){
			alert(`Insider Mode has been enabled!
You need to refresh the page to enable Insider exclusive features. Don't tell anyone how you did this.`);
		},20);
        
    }
}