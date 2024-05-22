document.getElementById(`loadingSearch`).style.display = "none";
document.getElementById(`searchCard`).style.display = "none";

var currVer = 'legacy';
$('#searchPlatform').append(`<option value=${currVer} selected="">Select a Platform</option>`);
$('#searchPlatform').append(`<option value="bskyuser">BlueSky (User)</option>`);
$('#searchPlatform').append(`<option value="discordserver">Discord (Server)</option>`);
//$('#searchPlatform').append(`<option value="mixernoapi">Mixerno.space (API)</option>`);
//$('#searchPlatform').append(`<option value="nextcountsapi">NextCounts (API)</option>`);
$('#searchPlatform').append(`<option value="parleruser">Parler (User)</option>`);
$('#searchPlatform').append(`<option value="rumbleuser">Rumble (User)</option>`);
//$('#searchPlatform').append(`<option value="reddituser">Reddit (User Karma)</option>`);
//$('#searchPlatform').append(`<option value="subreddit">Subreddit</option>`);
$('#searchPlatform').append(`<option value="storyfireuser">StoryFire (User)</option>`);
$('#searchPlatform').append(`<option value="storyfirevideo">StoryFire (Video)</option>`);
$('#searchPlatform').append(`<option value="threadsuser">Threads (User)</option>`);
$('#searchPlatform').append(`<option value="tiktokuser">Tiktok (User)</option>`);
$('#searchPlatform').append(`<option value="trilleruser">Triller (User)</option>`);
//$('#searchPlatform').append(`<option value="twitchuser">Twitch (User)</option>`);
$('#searchPlatform').append(`<option value="twitteruser">Twitter (User)</option>`);
$('#searchPlatform').append(`<option value="youtubeuser">YouTube (Channel)</option>`);
$('#searchPlatform').append(`<option value="youtubevideo">YouTube (Video or Livestream)</option>`);
$('#searchPlatform').append(`<option value="instagramuser">Instagram (User)</option>`);

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
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

const socialBadges = {
    verified: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    verifiedTwttr: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="color: var(--blue);"><path d="M9.00012 12L11.0001 14L15.0001 10M7.83486 4.69705C8.55239 4.63979 9.23358 4.35763 9.78144 3.89075C11.0599 2.80123 12.9403 2.80123 14.2188 3.89075C14.7667 4.35763 15.4478 4.63979 16.1654 4.69705C17.8398 4.83067 19.1695 6.16031 19.3031 7.83474C19.3603 8.55227 19.6425 9.23346 20.1094 9.78132C21.1989 11.0598 21.1989 12.9402 20.1094 14.2187C19.6425 14.7665 19.3603 15.4477 19.3031 16.1653C19.1695 17.8397 17.8398 19.1693 16.1654 19.303C15.4479 19.3602 14.7667 19.6424 14.2188 20.1093C12.9403 21.1988 11.0599 21.1988 9.78144 20.1093C9.23358 19.6424 8.55239 19.3602 7.83486 19.303C6.16043 19.1693 4.83079 17.8397 4.69717 16.1653C4.63991 15.4477 4.35775 14.7665 3.89087 14.2187C2.80135 12.9402 2.80135 11.0598 3.89087 9.78132C4.35775 9.23346 4.63991 8.55227 4.69717 7.83474C4.83079 6.16031 6.16043 4.83067 7.83486 4.69705Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    verifiedTwttrBlue: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none" style="color: var(--blue);"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.26701 3.45496C6.91008 3.40364 7.52057 3.15077 8.01158 2.73234C9.15738 1.75589 10.8426 1.75589 11.9884 2.73234C12.4794 3.15077 13.0899 3.40364 13.733 3.45496C15.2336 3.57471 16.4253 4.76636 16.545 6.26701C16.5964 6.91008 16.8492 7.52057 17.2677 8.01158C18.2441 9.15738 18.2441 10.8426 17.2677 11.9884C16.8492 12.4794 16.5964 13.0899 16.545 13.733C16.4253 15.2336 15.2336 16.4253 13.733 16.545C13.0899 16.5964 12.4794 16.8492 11.9884 17.2677C10.8426 18.2441 9.15738 18.2441 8.01158 17.2677C7.52057 16.8492 6.91008 16.5964 6.26701 16.545C4.76636 16.4253 3.57471 15.2336 3.45496 13.733C3.40364 13.0899 3.15077 12.4794 2.73234 11.9884C1.75589 10.8426 1.75589 9.15738 2.73234 8.01158C3.15077 7.52057 3.40364 6.91008 3.45496 6.26701C3.57471 4.76636 4.76636 3.57471 6.26701 3.45496ZM13.7071 8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 6.90237 12.6834 6.90237 12.2929 7.29289L9 10.5858L7.70711 9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071L8.29289 12.7071C8.68342 13.0976 9.31658 13.0976 9.70711 12.7071L13.7071 8.70711Z" fill="currentColor"></path></svg>',
    verifiedTwttrBusiness: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="color: var(--yellow);"><path d="M9.00012 12L11.0001 14L15.0001 10M7.83486 4.69705C8.55239 4.63979 9.23358 4.35763 9.78144 3.89075C11.0599 2.80123 12.9403 2.80123 14.2188 3.89075C14.7667 4.35763 15.4478 4.63979 16.1654 4.69705C17.8398 4.83067 19.1695 6.16031 19.3031 7.83474C19.3603 8.55227 19.6425 9.23346 20.1094 9.78132C21.1989 11.0598 21.1989 12.9402 20.1094 14.2187C19.6425 14.7665 19.3603 15.4477 19.3031 16.1653C19.1695 17.8397 17.8398 19.1693 16.1654 19.303C15.4479 19.3602 14.7667 19.6424 14.2188 20.1093C12.9403 21.1988 11.0599 21.1988 9.78144 20.1093C9.23358 19.6424 8.55239 19.3602 7.83486 19.303C6.16043 19.1693 4.83079 17.8397 4.69717 16.1653C4.63991 15.4477 4.35775 14.7665 3.89087 14.2187C2.80135 12.9402 2.80135 11.0598 3.89087 9.78132C4.35775 9.23346 4.63991 8.55227 4.69717 7.83474C4.83079 6.16031 6.16043 4.83067 7.83486 4.69705Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    verifiedTwttrGovernment: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="color: var(--gray);"><path d="M9.00012 12L11.0001 14L15.0001 10M7.83486 4.69705C8.55239 4.63979 9.23358 4.35763 9.78144 3.89075C11.0599 2.80123 12.9403 2.80123 14.2188 3.89075C14.7667 4.35763 15.4478 4.63979 16.1654 4.69705C17.8398 4.83067 19.1695 6.16031 19.3031 7.83474C19.3603 8.55227 19.6425 9.23346 20.1094 9.78132C21.1989 11.0598 21.1989 12.9402 20.1094 14.2187C19.6425 14.7665 19.3603 15.4477 19.3031 16.1653C19.1695 17.8397 17.8398 19.1693 16.1654 19.303C15.4479 19.3602 14.7667 19.6424 14.2188 20.1093C12.9403 21.1988 11.0599 21.1988 9.78144 20.1093C9.23358 19.6424 8.55239 19.3602 7.83486 19.303C6.16043 19.1693 4.83079 17.8397 4.69717 16.1653C4.63991 15.4477 4.35775 14.7665 3.89087 14.2187C2.80135 12.9402 2.80135 11.0598 3.89087 9.78132C4.35775 9.23346 4.63991 8.55227 4.69717 7.83474C4.83079 6.16031 6.16043 4.83067 7.83486 4.69705Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    lockedAcc: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitter"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="5" width="18" height="14" rx="4"></rect><path d="M10 9l5 3l-5 3z"></path></svg>',
    twitch: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitch"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z"></path><line x1="16" y1="8" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="12"></line></svg>',
    tiktok: '<svg class="icon icon-tabler icon-tabler-brand-tiktok" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"></path></svg>',
    soundcloud: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-soundcloud"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z"></path><line x1="9" y1="8" x2="9" y2="17"></line><line x1="6" y1="17" x2="6" y2="10"></line><line x1="3" y1="16" x2="3" y2="14"></line></svg>',
    reddit: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-reddit"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z"></path><path d="M12 8l1-5 6 1"></path><circle cx="19" cy="4" r="1"></circle><circle cx="9" cy="13" r=".5" fill="currentColor"></circle><circle cx="15" cy="13" r=".5" fill="currentColor"></circle><path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5"></path></svg>',
    discord: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path><path d="M7 16.5c3.5 1 6.5 1 10 0"></path><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5"></path><path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5"></path></svg>',
    rumble: '<svg class="icon icon-tabler icon-tabler-brand-rumble" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.993 9.108c.383 .4 .687 .863 .893 1.368a4.195 4.195 0 0 1 .006 3.166a4.37 4.37 0 0 1 -.887 1.372a20.233 20.233 0 0 1 -2.208 2a20.615 20.615 0 0 1 -2.495 1.669a21.322 21.322 0 0 1 -5.622 2.202a4.213 4.213 0 0 1 -3.002 -.404a3.98 3.98 0 0 1 -1.163 -.967a3.796 3.796 0 0 1 -.695 -1.312c-1.199 -3.902 -1.022 -8.312 .134 -12.23c.609 -2.057 2.643 -3.349 4.737 -2.874c3.88 .88 7.52 3.147 10.302 6.01z"></path><path d="M14.044 13.034c.67 -.505 .67 -1.489 0 -2.01a14.824 14.824 0 0 0 -1.498 -1.044a15.783 15.783 0 0 0 -1.62 -.865c-.77 -.35 -1.63 .139 -1.753 .973a15.385 15.385 0 0 0 -.1 3.786a1.232 1.232 0 0 0 1.715 1.027a14.783 14.783 0 0 0 1.694 -.827a14.46 14.46 0 0 0 1.562 -1.035v-.005z"></path></svg>',
    instagram: `<svg class="icon icon-tabler icon-tabler-brand-instagram" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M16.5 7.5l0 .01"></path></svg>`,
    threads: `<svg class="icon icon-tabler icon-tabler-brand-threads" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19 7.5c-1.333 -3 -3.667 -4.5 -7 -4.5c-5 0 -8 2.5 -8 9s3.5 9 8 9s7 -3 7 -5s-1 -5 -7 -5c-2.5 0 -3 1.25 -3 2.5c0 1.5 1 2.5 2.5 2.5c2.5 0 3.5 -1.5 3.5 -5s-2 -4 -3 -4s-1.833 .333 -2.5 1"></path></svg>`,
    storyfire: '<svg class="icon icon-tabler icon-tabler-flame" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z"></path></svg>',
    nextcounts: '<i class="icon-graph"></i>'
};


$("#searchBtn").click((function() {
    searchForUser(document.getElementById(`searchbar`).value, document.getElementById(`searchPlatform`).value)
}))

document.getElementById('searchPlatform').addEventListener("input", (function(e){
    if(document.getElementById(`searchPlatform`).value == 'mixernoapi' || document.getElementById(`searchPlatform`).value == 'nextcountsapi') {
        $('.input-group')[0].style.display = "none";
        searchForUser('a', document.getElementById(`searchPlatform`).value)
    } else {
        $('.input-group')[0].style.display = "flex";
    }
}))

document.getElementById("searchbar").addEventListener("keyup", (function(e) {
    13 === e.keyCode && searchForUser(document.getElementById(`searchbar`).value, document.getElementById(`searchPlatform`).value)
}))

function searchForUser(searchTerm, platform) {
    if(searchTerm == "") {
        toastr["warning"]("You need to provide an username for the search to work!", "Oops!");
    } else {
        document.getElementById(`loadingSearch`).style.display = "block";
        document.getElementById(`searchCard`).style.display = "none";

        if(platform == "reddituser") {
            document.getElementById(`searchpfp`).style.display = 'none';
        } else {
            document.getElementById(`searchpfp`).style.display = 'block';
        }
        
        try {
            switch (platform)
            {
                case "twitteruser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("twitch.tv")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/twitter/user/${t}`)
                    .done(function (dataa) {
                        if(dataa.success == true) {
                            let data = dataa.users[0];
                            document.getElementById(`searchFollowers`).innerHTML = `@${data.userDefiner}`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/twitter/followers/?u=${data.userDefiner}`;
                            if (data.verified == true) {
                                if (data.protectedAcc == true) {
                                    document.getElementById(`searchUsername`).innerHTML = `${data.name} ${socialBadges.verified} ${socialBadges.lockedAcc} ${socialBadges.twitter}`;
                                } else {
                                    document.getElementById(`searchUsername`).innerHTML = `${data.name} ${socialBadges.verified} ${socialBadges.twitter}`;
                                }
                            } else {
                                if (data.protectedAcc == true) {
                                    document.getElementById(`searchUsername`).innerHTML = `${data.name} ${socialBadges.lockedAcc} ${socialBadges.twitter}`;
                                } else {
                                    document.getElementById(`searchUsername`).innerHTML = `${data.name} ${socialBadges.twitter}`;
                                }
                            }
                            document.getElementById(`searchpfp`).src = data.pfp;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "tiktokuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("tiktok.com")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/tiktok/user/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            document.getElementById(`searchFollowers`).innerHTML = `@${data.userIdentifier}`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/tiktok/followers/?u=${data.userIdentifier}`;
                            if (data.verified == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${data.username} ${socialBadges.verified} ${socialBadges.tiktok}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${data.username} ${socialBadges.tiktok}`;
                            }
                            document.getElementById(`searchpfp`).src = data.userImg;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "twitchuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("twitch.tv")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/twitch/user/${t}`)
                    .done(function (dataa) {
                        if(dataa.success == true) {
                            data = dataa.results[0];

                            document.getElementById(`searchFollowers`).innerHTML = `${dataa.followers.toLocaleString()} Followers`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/twitch/followers/?u=${t}`;

                            if (data.partner == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${data.username} ${socialBadges.verified} ${socialBadges.twitch}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${data.username} ${socialBadges.twitch}`;
                            }
                            document.getElementById(`searchpfp`).src = dataa.avatar;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "bskyuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[4]
                    } else {
                        if (e.includes("/bsky.app")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/bluesky/user/${t}`)
                    .done(function (dataa) {
                        if(dataa.success == true) {
                            //define data as the user with a matching handle to the variable t
                            data = dataa.results.filter(function (e) {
                                return e.handle == t
                            })[0];
                            console.log(data)
                            document.getElementById(`searchFollowers`).innerHTML = `@${data.handle}`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/bluesky/user/?u=${data.handle}`;

                            if (data.verified == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${data.username} ${socialBadges.verified}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${data.username}`;
                            }
                            document.getElementById(`searchpfp`).src = data.avatar;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "trilleruser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("triller.co")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/triller/user/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            document.getElementById(`searchFollowers`).innerHTML = `${data.results[0].followers.toLocaleString()} Followers`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/triller/followers/?u=${data.results[0].definer}`;
                            if (data.results[0].verified == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${data.results[0].username} ${socialBadges.verified}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${data.results[0].username}`;
                            }
                            document.getElementById(`searchpfp`).src = data.results[0].avatar;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "discordserver":
                    $.ajax(`https://api-v2.nextcounts.com/api/discord/server/${searchTerm}`)
                    .done(function (data) {
                        if(data.success == true) {
                            document.getElementById(`searchFollowers`).innerHTML = `${data.membersCount.toLocaleString()} Members`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/discord/server/?u=${searchTerm}`;
                            document.getElementById(`searchUsername`).innerHTML = `${data.guild.serverName} ${socialBadges.discord}`;
                            document.getElementById(`searchpfp`).src = data.guild.serverImg;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "reddituser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[4]
                    } else {
                        if (e.includes("reddit.com")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/reddit/u/${t}`)
                    .done(function (data) {
                        if(!data.error) {
                            document.getElementById(`searchFollowers`).innerHTML = `${data.totalKarma.toLocaleString()} Total Karma`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/reddit/u/?u=${t}`;
                            document.getElementById(`searchUsername`).innerHTML = `${data.name} ${socialBadges.reddit}`;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "subreddit":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[4]
                    } else {
                        if (e.includes("reddit.com")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/reddit/r/${t}`)
                    .done(function (data) {
                        if(!data.error) {
                            document.getElementById(`searchFollowers`).innerHTML = `${data.members.toLocaleString()} Members`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/reddit/r/?u=${t}`;
                            document.getElementById(`searchUsername`).innerHTML = `${data.subreddit} ${socialBadges.reddit}`;
                            document.getElementById(`searchpfp`).src = `https://cors.nextcounts.com/raw?url=${data.subImg}`;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "storyfireuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[2]
                    } else {
                        if (e.includes("storyfire.com")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/storyfire/user/${t}`)
                    .done(function (data) {
                        if(!data.error && data.count > 0) {
                            document.getElementById(`searchFollowers`).innerHTML = `${data.results[0].followers.toLocaleString()} Subscribers`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/storyfire/user/?u=${data.results[0].channelID}`;
                            if (data.results[0].verified == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${data.results[0].name} ${socialBadges.verified} ${socialBadges.storyfire}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${data.results[0].name} ${socialBadges.storyfire}`;
                            }
                            document.getElementById(`searchpfp`).src = data.results[0].userImg;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "storyfirevideo":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[4]
                    } else {
                        if (e.includes("storyfire.com")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/storyfire/video/${t}`)
                    .done(function (data) {
                        if(!data.error && data.count > 0) {
                            document.getElementById(`searchFollowers`).innerHTML = `Uploader: ${data.results[0].uploader} - ${data.results[0].views.toLocaleString()} Views`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/storyfire/video/?v=${data.results[0].videoID}`;
                            document.getElementById(`searchUsername`).innerHTML = `${data.results[0].title} ${socialBadges.storyfire}`;
                            document.getElementById(`searchpfp`).src = data.results[0].thumbnail;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get the video. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get the video. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "youtubeuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[4]
                    } else {
                        if (e.includes("youtube.com")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/youtube/channel/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            document.getElementById(`searchFollowers`).innerHTML = `${abbreviateGivenNumber(data.results[0].subcount)} Subscribers`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/youtube/user/?u=${data.results[0].cid}`;
                            document.getElementById(`searchUsername`).innerHTML = `${data.results[0].displayName} ${socialBadges.youtube}`;
                            document.getElementById(`searchpfp`).src = data.results[0].pfp;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "youtubevideo":
                    let isID = false;
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        if(e.includes("youtu.be")) {
                            var n = e.split("/");
                            t = n[3];
                            isID = true;
                        } else {
                            var n = e.split("/");
                            t = n[3].split('=')[1]
                            console.log(n, t)
                            isID = true;
                        }
                    } else {
                        if (e.includes("youtube.com")) {
                            n = e.split("/");
                            t = n[2]
                            console.log(n, t)
                            isID = true;
                        } else t = e;
                    }

                    if(isID == false) {
                        $.ajax(`https://api-v2.nextcounts.com/api/search/youtube/video/${t}`)
                        .done(function (data) {
                            if(!data.error) {
                                document.getElementById(`searchFollowers`).innerHTML = `Uploader: ${data.results[0].channelName}`;
                                document.getElementById(`searchUsername`).href = `https://nextcounts.com/youtube/video/?v=${data.results[0].videoid}`;
                                document.getElementById(`searchUsername`).innerHTML = `${data.results[0].title} ${socialBadges.youtube}`;
                                document.getElementById(`searchpfp`).src = data.results[0].thumbnails.medium.url;
                                document.getElementById(`loadingSearch`).style.display = "none";
                                document.getElementById(`searchCard`).style.display = "block";
                            } else {
                                toastr["error"]("We weren't able to get the video. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                                document.getElementById(`loadingSearch`).style.display = "none";
                                document.getElementById(`searchCard`).style.display = "none";
                            }
                        })
                        .fail(function () {
                            toastr["error"]("We weren't able to get the video. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        });
                    } else {
                        $.ajax(`https://api-v2.nextcounts.com/api/youtube/videos/info/${t}`)
                        .done(function (data) {
                            if(!data.error) {
                                if(data.results[0].isLive == true) {
                                    document.getElementById(`searchFollowers`).innerHTML = `Uploader: ${data.results[0].channelTitle} - ${Number(data.results[0].liveViewers).toLocaleString()} Watching`;
                                } else {
                                    document.getElementById(`searchFollowers`).innerHTML = `Uploader: ${data.results[0].channelTitle} - ${Number(data.results[0].views).toLocaleString()} Views`;
                                }
                                document.getElementById(`searchUsername`).href = `https://nextcounts.com/youtube/video/?v=${data.results[0].videoid}`;
                                document.getElementById(`searchUsername`).innerHTML = `${data.results[0].title} ${socialBadges.youtube}`;
                                document.getElementById(`searchpfp`).src = data.results[0].thumbnails.medium.url;
                                document.getElementById(`loadingSearch`).style.display = "none";
                                document.getElementById(`searchCard`).style.display = "block";
                            } else {
                                toastr["error"]("We weren't able to get the video. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                                document.getElementById(`loadingSearch`).style.display = "none";
                                document.getElementById(`searchCard`).style.display = "none";
                            }
                        })
                        .fail(function () {
                            toastr["error"]("We weren't able to get the video. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        });
                    }
                break;
                case "rumbleuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[4]
                    } else {
                        if (e.includes("rumble.com")) {
                            n = e.split("/");
                            t = n[2]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/rumble/user/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            let user = data.users[0];
                            document.getElementById(`searchFollowers`).innerHTML = `${user.followersCount.toLocaleString()} Followers`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/rumble/user/?u=${user.id}`;

                            document.getElementById(`searchUsername`).innerHTML = `${user.nickname}`;
                            document.getElementById(`searchpfp`).src = user.avatar;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to search for the user. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "parleruser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("parler.com")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/parler/user/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            let user = data.users[0];
                            document.getElementById(`searchFollowers`).innerHTML = `${user.followersCount.toLocaleString()} Followers (@${user.username})`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/parler/user/?u=${user.username}`;

                            document.getElementById(`searchUsername`).innerHTML = `${user.nickname}`;
                            document.getElementById(`searchpfp`).src = user.avatar;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to search for the user. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "instagramuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("instagram.com")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/instagram/user/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            let user = data.users[0];
                            document.getElementById(`searchFollowers`).innerHTML = `@${user.user_name}`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/instagram/user/?u=${user.user_name}`;

                            if (user.verified == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${user.full_name} ${socialBadges.is_verified}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${user.full_name}`;
                            }
                            document.getElementById(`searchpfp`).src = user.profile_pic;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                case "threadsuser":
                    var e = searchTerm.replace("@", ""), t = "";
                    if (e.includes("https://") || e.includes("http://")) {
                        var n = e.split("/");
                        t = n[3]
                    } else {
                        if (e.includes("instagram.com")) {
                            n = e.split("/");
                            t = n[1]
                        } else t = e;
                    }

                    $.ajax(`https://api-v2.nextcounts.com/api/search/instagram/user/${t}`)
                    .done(function (data) {
                        if(data.success == true) {
                            let user = data.users[0];
                            document.getElementById(`searchFollowers`).innerHTML = `@${user.user_name}`;
                            document.getElementById(`searchUsername`).href = `https://nextcounts.com/threads/user/?u=${user.id}`;

                            if (user.verified == true) {
                                document.getElementById(`searchUsername`).innerHTML = `${user.full_name} ${socialBadges.verified}`;
                            } else {
                                document.getElementById(`searchUsername`).innerHTML = `${user.full_name}`;
                            }
                            document.getElementById(`searchpfp`).src = user.profile_pic || user.avatar;
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "block";
                        } else {
                            toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                            document.getElementById(`loadingSearch`).style.display = "none";
                            document.getElementById(`searchCard`).style.display = "none";
                        }
                    })
                    .fail(function () {
                        toastr["error"]("We weren't able to get who the user is. If you think this is a mistake, contact us on Twitter, @NextCounts.", "Something went wrong.");
                        document.getElementById(`loadingSearch`).style.display = "none";
                        document.getElementById(`searchCard`).style.display = "none";
                    });
                break;
                default:
                    toastr["warning"]("You forgot to select a valid platform!", "Oops!")
                    document.getElementById(`loadingSearch`).style.display = "none";
                    document.getElementById(`searchCard`).style.display = "none";
                break;
            }
        } catch (e) {
            toastr["error"]("We weren't able to contact our servers. Please, try searching something else or contact us so we can fix this. Our Twitter handle is @NextCounts", "Something went wrong.");
            document.getElementById(`loadingSearch`).style.display = "none";
            document.getElementById(`searchCard`).style.display = "none";
        }
    }
}