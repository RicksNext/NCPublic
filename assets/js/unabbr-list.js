$.getJSON("https://api-v2.nextcounts.com/api/youtube/channels/unabbreviated/list", function (data) {
    let totalCards = 0,
        cardsAdded = 0;

    //sort the channels by the most subscribers
    let chanList = data.items.sort(function (a, b) {
        return b.subs - a.subscribers;
    });

    let totalSubs = 0;
    for (let i = 0; i < chanList.length; i++) {
        totalSubs += chanList[i].subscribers;
    }

    document.getElementById('infoPar').innerHTML = `Total of Channels: <strong>${data.count.toLocaleString()}</strong> - Total Subscribers Counted: <strong>${totalSubs.toLocaleString()}</strong>`;

    for (var i = 0; i < data.count; i++) {
        let channel = chanList[i];

        //create a card element for each channel
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="card-body text-center"><img class="rounded-circle img-fluid" src="${channel.channelImg}" width="87vw" style="margin-right: 10px;" /><div><h4 class="card-title"><a href="https://nextcounts.com/youtube/user/?u=${channel.key}">${channel.channelName}</a></h4><h6 class="text-muted mb-2">${(channel.subscribers).toLocaleString()} Subscribers</h6></div></div>`;

        document.getElementsByClassName("card-columns")[$('.card-columns').length - 1].appendChild(card);

        if (cardsAdded < 2) {
            cardsAdded++;
        } else {
            cardsAdded = 0;
            totalCards++;
            $('#iushndaiuhdusa').append(`<div class="card-columns"></div>`.toString());
        }
    }
});