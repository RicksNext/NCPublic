$.getJSON("https://api-v2.nextcounts.com/api/youtube/channels/unabbreviated/list", function (data) {
    let totalCards = 0,
        cardsAdded = 0;

    for (var i = 0; i < data.count; i++) {
        let channel = data.data[i];

        //create a card element for each channel
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="card-body text-center"><img class="rounded-circle img-fluid" src="${channel.channelImg}" width="87vw" style="margin-right: 10px;" /><div><h4 class="card-title"><a href="https://nextcounts.com/youtube/user/?u=${channel.key}">${channel.channelName}</a></h4><h6 class="text-muted mb-2">${(channel.subs).toLocaleString()} Subscribers</h6></div></div>`;

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