$.getJSON("https://api-v2.nextcounts.com/api/election/", function (data) {
    for (let i = 0; i < (data.availableElections).length; i++) {
        $('#electionSelection').append(`<option value="${data.availableElections[i]}">${data.electionName[i]}</option>`);
    }
});

$('#electionSelection').change(function () {
    if($('#electionSelection').val() == 'null') return $('#loadElection').attr('href', ``);

    return $('#loadElection').attr('href', `counts/?country=${($('#electionSelection').val()).replace(/[^a-z]/gi, "")}&year=${($('#electionSelection').val()).replace(/\D/g, "")}`);
});