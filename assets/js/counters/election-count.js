//URL Handler
const queryString = window.location.search, urlParams = new URLSearchParams(queryString);

function calcTime() {
    var now = new Date();
    var time = now.getTime();
    var localOffset = -1 * now.getTimezoneOffset() * 60000;
    var newDate = new Date(time + localOffset).getTime();

    return newDate;
};

const textBright = "#858585", lineColor = "#858585", socialColor = "#f35d06";

var chart;

var country = urlParams.get("country"), year = urlParams.get("year");
!country ? country = "brazil" : country = country;
!year ? year = "2022" : year = year;

var firstLoad = true;
var votesEachCandidate = [];

setInterval(function () {
    $.getJSON(`https://api-v2.nextcounts.com/api/election/${country}/${year}`, function (data) {
        if(firstLoad == true) $('#topheading').text(data.fullStr);

        switch (country) {
            case "brazil":
                if(firstLoad == true) $('#countryFlag').attr('src', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg');
                let totalCards = 0, cardsAdded = 0;

                //change string in progress bar
                $('#totalVotesCheckedPB').text(`Election in Progress: ${data.apuracao.andamentoPorcentagem}%`);
                $('#totalVotesCheckedPB').attr('aria-valuenow', data.apuracao.andamentoPorcentagem.replace(',', '.'));
                $('#totalVotesCheckedPB').css('width', `${data.apuracao.andamentoPorcentagem.replace(',', '.')}%`);
                //add class "bg-success" if progress bar is 100%
                if (data.apuracao.definido == true) {
                    $('#totalVotesCheckedPB').addClass('bg-success');
                }

                //sort candidates by votes
                let candidates = data.candidatos.sort(function(a, b) {
                    return b.votos - a.votos;
                });

                $('#userImg-1').attr('src', candidates[0].foto);
                data.apuracao.definido == true ? $('#username-1').text(`${candidates[0].nome} ${socialBadges.verified} - ${candidates[0].partido}`) : $('#username-1').text(`${candidates[0].nome} - ${candidates[0].partido}`);
                $('#username-1').removeClass('skeleton skeleton-text');
                $('#mainOdometer-1').text(candidates[0].votos);

                $('#userImg-2').attr('src', candidates[1].foto);
                $('#username-2').text(`${candidates[1].nome} - ${candidates[1].partido}`);
                $('#username-2').removeClass('skeleton skeleton-text');
                $('#mainOdometer-2').text(candidates[1].votos);

                if(firstLoad == true) for (var i = 0; i < candidates.length - 2; i++) {
                    let candidate = candidates[i + 2];

                    //create a card element for each candidate
                    let card = document.createElement("div");
                    card.className = "card";
                    card.innerHTML = `
                    <div class="card-header d-lg-flex justify-content-lg-start align-items-lg-center"><img
                        class="rounded-circle candidPhoto" style="width: 40px;height: 40px;margin-right: 5px;"
                        src=${candidate.foto}><p class="candidName">${candidate.nome} - ${candidate.partido}</p>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title smallOdometer odometer">${Math.floor(candidate.votos)}</h3>
                        <p class="card-text">Votes</p>
                    </div>`;

                    document.getElementsByClassName("card-columns")[$('.card-columns').length - 1].appendChild(card);

                    if (cardsAdded < 2) {
                        cardsAdded++;
                    } else {
                        cardsAdded = 0;
                        totalCards++;
                        $('#iushndaiuhdusa').append(`<div class="card-columns"></div>`.toString());
                    }
                }

                $('#gapcounter').text(Math.floor(candidates[0].votos - candidates[1].votos));
                $('#gapcounter').addClass('odometer');

                let firstUpdateChart = [];
                for (var i = 0; i < candidates.length; i++) {
                    firstUpdateChart.push({name: candidates[i].nome, marker: { enabled: false } });
                }

                if(firstLoad == true) {
                    chart = Highcharts.chart('gapchart', {
                        chart: {
                            type: 'spline',
                            backgroundColor: "transparent",
                            plotBorderColor: "transparent",
                            zoomType: "x",
                        },
                        title: {
                            text: 'Total Votes each candidate received'
                        },
                        credits: {
                            enabled: true,
                            text: "NextCounts - This chart only updates when the votes of a candidate changes",
                            href: "https://nextcounts.com"
                        },
                        xAxis: {
                            type: "datetime",
                            gridLineColor: lineColor,
                            labels: {
                                style: {
                                    color: textBright,
                                },
                            },
                            lineColor: lineColor,
                            minorGridLineColor: "#858585",
                            tickColor: lineColor,
                        },
                        yAxis: {
                            title: {
                                enabled: false
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
                        plotOptions: {
                            area: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        series: firstUpdateChart
                    });
                    for (var i = 0; i < candidates.length; i++) {
                        votesEachCandidate.push(candidates[i].votos);
                        chart.series[i].addPoint([Date.now(), candidates[i].votos]);
                    };

                } else {
                    for (var i = 0; i < candidates.length; i++) {
                        //check if the candidate has different votes than the archived in votesEachCandidate
                        if (votesEachCandidate[i] != candidates[i].votos) {
                            //if it's different, update the chart
                            chart.series[i].addPoint([Date.now(), candidates[i].votos]);
                            votesEachCandidate[i] = candidates[i].votos;
                        }

                        if(i >= 2) {
                            $(`.odometer`)[i].innerHTML = candidates[i].votos;
                            $(`.candidPhoto`)[i-2].src = candidates[i].foto;
                            $('.candidName')[i-2].innerHTML = `${candidates[i].nome} - ${candidates[i].partido}`;
                        }
                    }
                }
                return firstLoad = false;
                break;
            default:
                alert("The country you have selected is not available. The counter is not going to load.");
                break;
        }
    });
}, 2000);