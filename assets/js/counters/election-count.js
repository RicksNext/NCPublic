//URL Handler
const queryString = window.location.search, urlParams = new URLSearchParams(queryString);

function calcTime() {
    var now = new Date();
    var time = now.getTime();
    var localOffset = -1 * now.getTimezoneOffset() * 60000;
    var newDate = new Date(time + localOffset).getTime();

    return newDate;
};

const textBright = "#858585", lineColor = "#858585";

var chart, countryChart;

var country = urlParams.get("country"), year = urlParams.get("year");
!country ? country = "us" : country = country;
!year ? year = "2024" : year = year;

var firstLoad = true;
var votesEachCandidate = [];

setInterval(function () {
    $.getJSON(`https://api-v2.nextcounts.com/api/election/${country}/${year}`, function (data) {
        if(firstLoad == true) $('#topheading').text(data.election.title);

        if(firstLoad == true) $('#countryFlag').attr('src', data.election.flag);
        let totalCards = 0, cardsAdded = 0;

        //change string in progress bar
        if(data.election.progress) {
            $('#totalVotesCheckedPB').attr('aria-valuenow', data.election.progress);
            $('#totalVotesCheckedPB').css('width', `${data.election.progress}%`);
            $('#totalVotesCheckedPB').text(`Election in Progress: ${data.election.progress}%`);

            if(data.election.hasWinner == true) {
                $('#totalVotesCheckedPB').text(`Election has a Winner`);
                $('#totalVotesCheckedPB').addClass('bg-success');
            }
        }

        //sort candidates by votes
        let candidates = data.election.candidates.sort(function(a, b) {
            return b.totalVotes - a.totalVotes;
        });

        $('#userImg-1').attr('src', candidates[0].image);
        data.election.hasWinner == true && data.election.candidates[0].winner == true ? document.getElementById(`username-1`).innerHTML = (`${candidates[0].name} ${socialBadges.verified} - ${candidates[0].party}`) : document.getElementById(`username-1`).innerHTML = (`${candidates[0].name} - ${candidates[0].party}`); // code only valid if election is similar to brazilian one
        $('#username-1').removeClass('skeleton skeleton-text');
        $('#mainOdometer-1').text(candidates[0].totalVotes);

        $('#userImg-2').attr('src', candidates[1].image);
        $('#username-2').text(`${candidates[1].name} - ${candidates[1].party}`);
        $('#username-2').removeClass('skeleton skeleton-text');
        $('#mainOdometer-2').text(candidates[1].totalVotes);

        if(firstLoad == true) for (var i = 0; i < candidates.length - 2; i++) {
            let candidate = candidates[i + 2];

            //create a card element for each candidate
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
            <div class="card-header d-lg-flex justify-content-lg-start align-items-lg-center"><img
                class="rounded-circle candidPhoto" style="width: 40px;height: 40px;margin-right: 5px;"
                src=${candidate.image}><p class="candidName">${candidate.name} - ${candidate.party}</p>
            </div>
            <div class="card-body">
            <div class="card-title smallOdometer odometer">${Math.floor(candidate.totalVotes)}</div>
                <!-- <h3 class="card-title smallOdometer odometer">${Math.floor(candidate.totalVotes)}</h3> -->
                <p class="card-text lowerPar">${((candidate.totalVotes / data?.election?.validVotes) * 100).toLocaleString()}% of Votes</p>
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

        $(`#gapcounter`).text(Math.floor(candidates[0].totalVotes - candidates[1].totalVotes));

        let firstUpdateChart = [];
        for (var i = 0; i < data.election.candidates.length; i++) {
            firstUpdateChart.push({name: data.election.candidates[i].name, marker: { enabled: false } });
        }

        let countryChartData = [];

        $.getJSON(data.election.map, function (mapdata) {
            data.election.states.forEach(element => {
                countryChartData.push(Highcharts.extend({
                    'hc-key': `${country.toLowerCase()}-${element.abbreviation.toLowerCase()}`,
                    value: element.electoralVotes,
                    name: element.name,
                    color: element.winner.toLowerCase() == data.election.candidates[0].party.toLowerCase() ? data.election.candidates[0].color : data.election.candidates[1].color
                }));
                

                console.log(countryChartData);
            });

            countryChart = Highcharts.mapChart('countryChart', {
                chart: {
                    map: mapdata,
                    backgroundColor: "transparent",
                    plotBorderColor: "transparent",
                },
                title: {
                    text: data.election.title
                },
                credits: {
                    enabled: true,
                    text: `Data Source: ${data.election.source} - NextCounts`,
                    href: "https://nextcounts.com"
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                series: [{
                    data: countryChartData,
                    mapData: mapdata,
                    joinBy: 'hc-key',
                    name: 'Total Votes',
                    dataLabels: {
                        enabled: true,
                        format: '{point.properties.hc-a2}'
                    }
                }]
            });
        });

        if(firstLoad == true) {
            $('#gapcounter').addClass('odometer');

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
                    text: `NextCounts - Data Source: ${data.election.source}`,
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

            for (var i = 0; i < data.election.candidates.length; i++) {
                votesEachCandidate.push(data.election.candidates[i].totalVotes);
                chart.series[i].addPoint([Date.now(), data.election.candidates[i].totalVotes]);
                if(i>=2) {
                    new Odometer({
                        el: document.getElementsByClassName(`smallOdometer`)[i-2],
                        value: data.election.candidates[i].totalVotes
                    });
                }
                new Odometer({
                    el: document.getElementById(`gapcounter`),
                    value: Math.floor(data.election.candidates[0].totalVotes - data.election.candidates[1].totalVotes)
                });
            };

        } else {
            for (var i = 0; i < candidates.length; i++) {
                data.election.validVotes ? document.getElementsByClassName(`lowerPar`)[i].innerHTML = (`${((data.election.candidates[i].totalVotes / data.election.validVotes) * 100).toLocaleString()}% of Votes`) : document.getElementsByClassName(`lowerPar`)[i].innerHTML = (`Votes`);
                //check if the candidate has different votes than the archived in votesEachCandidate
                if (votesEachCandidate[i] != data.election.candidates[i].totalVotes) {
                    //if it's different, update the chart
                    chart.series[i].addPoint([Date.now(), data.election.candidates[i].totalVotes]);
                    votesEachCandidate[i] = data.election.candidates[i].totalVotes;
                }

                if(i >= 2) {
                    document.getElementsByClassName(`smallOdometer`)[i-2].innerHTML = data.election.candidates[i].totalVotes;
                    $(`.candidPhoto`)[i-2].src = data.election.candidates[i].image;
                    document.getElementsByClassName(`candidName`)[i-2].innerHTML = `${candidates[i].nome} - ${candidates[i].partido}`;
                }
            }
        }
        return firstLoad = false;
    });
}, 2000);