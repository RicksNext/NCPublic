$.getJSON("https://api-v2.nextcounts.com/api/youtube/channels/unabbreviated/list", function (data) {
    let totalCards = 0,
        cardsAdded = 0;

    //sort the channels by the most subscribers
    let chanList = data.items.sort(function (a, b) {
        return b.subscribers - a.subscribers;
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
        let avatarHtml = i === 0 ? 
            `<div style="position: relative; display: inline-block;">
                <img class="rounded-circle flex-shrink-0 mr-3 fit-cover" src="${channel.channelImg}" width="50" height="50" />
                <img src="https://cdn-icons-png.flaticon.com/512/6941/6941697.png" style="position: absolute; top: -8px; right: 12px; width: 20px; height: 20px; transform: rotate(20deg);" />
            </div>` : 
            `<img class="rounded-circle flex-shrink-0 mr-3 fit-cover" src="${channel.channelImg}" width="50" height="50" />`;
        
        card.innerHTML = `<div class="card-body p-4"><div class="d-flex">${avatarHtml}<div><a class="font-weight-bold mb-0" href="https://nextcounts.com/youtube/user/?u=${channel.key}">${channel.channelName}</a><p class="text-muted mb-0">${(channel.subscribers).toLocaleString()} Subscribers</p></div></div></div>`

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