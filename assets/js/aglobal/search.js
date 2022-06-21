document.getElementById(`loadingSearch`).style.display = "none";
document.getElementById(`searchCard`).style.display = "none";

var currVer = 'ncv312lesgo';
$('#searchPlatform').append(`<option value=${currVer} selected="">Select a Platform</option>`);
$('#searchPlatform').append(`<option value="brimeuser">Brime.tv (User)</option>`);
$('#searchPlatform').append(`<option value="discordserver">Discord (Server)</option>`);
//$('#searchPlatform').append(`<option value="mixernoapi">Mixerno.space (API)</option>`);
//$('#searchPlatform').append(`<option value="nextcountsapi">NextCounts (API)</option>`);
//$('#searchPlatform').append(`<option value="reddituser">Reddit (User Karma)</option>`);
//$('#searchPlatform').append(`<option value="subreddit">Subreddit</option>`);
$('#searchPlatform').append(`<option value="storyfireuser">StoryFire (User)</option>`);
$('#searchPlatform').append(`<option value="storyfirevideo">StoryFire (Video)</option>`);
$('#searchPlatform').append(`<option value="tiktokuser">Tiktok (User)</option>`);
$('#searchPlatform').append(`<option value="trilleruser">Triller (User)</option>`);
//$('#searchPlatform').append(`<option value="twitchuser">Twitch (User)</option>`);
$('#searchPlatform').append(`<option value="twitteruser">Twitter (User)</option>`);
$('#searchPlatform').append(`<option value="youtubeuser">YouTube (Channel)</option>`);
$('#searchPlatform').append(`<option value="youtubevideo">YouTube (Video)</option>`);

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
    lockedAcc: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitter"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="5" width="18" height="14" rx="4"></rect><path d="M10 9l5 3l-5 3z"></path></svg>',
    twitch: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-twitch"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z"></path><line x1="16" y1="8" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="12"></line></svg>',
    tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5"></path></svg>',
    soundcloud: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-soundcloud"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z"></path><line x1="9" y1="8" x2="9" y2="17"></line><line x1="6" y1="17" x2="6" y2="10"></line><line x1="3" y1="16" x2="3" y2="14"></line></svg>',
    reddit: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-reddit"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z"></path><path d="M12 8l1-5 6 1"></path><circle cx="19" cy="4" r="1"></circle><circle cx="9" cy="13" r=".5" fill="currentColor"></circle><circle cx="15" cy="13" r=".5" fill="currentColor"></circle><path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5"></path></svg>',
    discord: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path><path d="M7 16.5c3.5 1 6.5 1 10 0"></path><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5"></path><path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5"></path></svg>',
    storyfire: '<i class="fas fa-fire"></i>',
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
                .done(function (data) {
                    if(data.success == true) {
                        document.getElementById(`searchFollowers`).innerHTML = `${data.followers.toLocaleString()} Followers`;
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
                .done(function (dataa) {
                    var data = JSON.parse(dataa);
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
            case "brimeuser":
                var e = searchTerm.replace("@", ""), t = "";
                if (e.includes("https://") || e.includes("http://")) {
                    var n = e.split("/");
                    t = n[3]
                } else {
                    if (e.includes("brime.tv")) {
                        n = e.split("/");
                        t = n[1]
                    } else t = e;
                }

                $.ajax(`https://api-v2.nextcounts.com/api/brime/user/${t}`)
                .done(function (data) {
                    if(data.success == true) {
                        document.getElementById(`searchFollowers`).innerHTML = `${data.followers.toLocaleString()} Followers`;
                        document.getElementById(`searchUsername`).href = `https://nextcounts.com/brime/channel/?u=${t}`;

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
                        document.getElementById(`searchUsername`).href = `https://analytics.nextcounts.com/reddit/r/?u=${t}`;
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
            break;
            default:
                toastr["warning"]("You forgot to select a valid platform!", "Oops!")
                document.getElementById(`loadingSearch`).style.display = "none";
                document.getElementById(`searchCard`).style.display = "none";
            break;
        }
    }
}