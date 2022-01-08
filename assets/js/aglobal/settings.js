window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-R34Z4R4SVB');

$('#themeSelector').append(
    `<optgroup label="Select your theme">
        <option value="white" selected>White (Default)</option>
        <option value="dark">Dark</option>
    </optgroup>`
);

if(window.location.pathname == '/') {
    $(`#chartGraphGlobalSwitch`).hide();
    $(`#chartGraphSingleSwitch`).hide();
    $(`#settingsVisualDisclaimer`).show();
} else {
    $(`#settingsVisualDisclaimer`).hide();
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
        default: {
            $('html')[0].className = 'whitetheme';
            $('body')[0].className = 'whitetheme';
            $('#themeSelector')[0].value = `white`;
            $('#app-navbar')[0].className = $('#app-navbar')[0].className.replace(` navbar-dark`, ` navbar-light`);
            break;
        }
    }
}

/*
if(localStorage.getItem("fluentBtn") == null || localStorage.getItem("fluentBtn") == "") {
    localStorage.setItem("fluentBtn", "false");
} else {
    switch(localStorage.getItem("fluentBtn")) {
        case "false": {
            $('.btn').removeClass('reveal');
            break;
        }
        default: {
            $('.btn').addClass('reveal');
            break;
        }
    }
}
*/

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

/*
document.getElementById("enableFluentBtn").addEventListener('change', function() {
    if (this.checked) {
      $('.btn').addClass('reveal');
      localStorage.setItem("fluentBtn", "true");
    } else {
      $('.btn').removeClass('reveal');
      localStorage.setItem("fluentBtn", "false");
    }
});
*/

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

/*
window.onload = () => {
	let reveals = document.getElementsByClassName('reveal'), 
    maskSize = 150;
    
    //$('.reveal').removeClass('btn');
	window.addEventListener('mousemove', (e) => {
        Array.from(reveals).forEach((element) => {
        const {top, left, width, height} = element.getBoundingClientRect();
        //const x = e.pageX - left - maskSize / 2, y = e.pageY - top - maskSize / 2;
        const x = e.screenX - left - maskSize / 2, y = e.screenY - top - maskSize / 2;
        //console.log(e.pageY - element.offsetTop / 2)

        element.style.webkitMaskPosition = `${x}px ${y}px`;
        element.style.webkitMaskSize = `${maskSize}px ${maskSize}px`;
        });
	});
}
*/