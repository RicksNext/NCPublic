var updateCounts = {
    name: function(name) {
        document.getElementById('username').innerHTML = name;
    },
    pfp: function(url) {
        document.getElementById('userImg').src = url;
    },
    banner: function(url) {
        if(window.location.href.includes(`/large/`)) {
            if(url == "hide" || url == null) {
                document.getElementById('userBanner').src = `https://nextcounts.com/assets/img/main%20banner%20teal%20black.png`;
            } else {
                document.getElementById('userBanner').src = url;
            }
        } else {
            return;
        }
    },
    count: function(count) {
        document.getElementById('mainOdometer').innerHTML = count;
    }
}

//URL Handler
const queryString = window.location.search, urlParams = new URLSearchParams(queryString);

const user = urlParams.get('u'), platform = urlParams.get('p'), odometerInURL = urlParams.get('o');

//badges
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
    instagram: '<i class="fa fa-instagram"></i>',
    nextcounts: '<i class="fas fa-chart-line" id="brand-logo"></i>',
    error: '<i class="la la-warning"></i>'
};

var hasLoadedBefore = false;

if(user == null && platform == null || user == "" && platform == "") {
    updateCounts.name(`${socialBadges.error} No user/platform specified!`);
    updateCounts.count(`${socialBadges.error} No user/platform specified!`);	
    console.log(0);
} else {
    if(platform == "reddituser" || platform == "nasdaq") {
        document.getElementById(`userImg`).style.display = 'none';
    } else {
        document.getElementById(`userImg`).style.display = 'block';
    }

    switch(platform)
    {
        case 'twitteruser':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/twitter/user/${user}`)
                .done(function (dataa) {
                    let data = JSON.parse(dataa);
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.followers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.pfp.large);
                        updateCounts.banner(data.banner);
                        updateCounts.count(data.followers);
                        if (data.verified == true) {
                            if (data.protectedAcc == true) {
                                updateCounts.name(`${socialBadges.twitter} ${data.username} ${socialBadges.verified} ${socialBadges.lockedAcc}`);
                            } else {
                                updateCounts.name(`${socialBadges.twitter} ${data.username} ${socialBadges.verified}`);
                            }
                        } else {
                            if (data.protectedAcc == true) {
                                updateCounts.name(`${socialBadges.twitter} ${data.username} ${socialBadges.lockedAcc}`);
                            } else {
                                updateCounts.name(`${socialBadges.twitter} ${data.username}`);
                            }
                        }
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
            break;
        case 'twitchfollowers':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/twitch/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.pfp);
                        updateCounts.banner(data.channelBanner);
                        updateCounts.count(data.followers);
                        if (data.partner == true) {
                            updateCounts.name(`${socialBadges.twitch} ${data.username} ${socialBadges.verified}`);
                        } else {
                            updateCounts.name(`${socialBadges.twitch} ${data.username}`);
                        }
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 5000);
            break;
        case 'twitchviews':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/twitch/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.pfp);
                        updateCounts.banner(data.channelBanner);
                        updateCounts.count(data.views);
                        if (data.partner == true) {
                            updateCounts.name(`${socialBadges.twitch} ${data.username} ${socialBadges.verified}`);
                        } else {
                            updateCounts.name(`${socialBadges.twitch} ${data.username}`);
                        }
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 5000);
            break;
        case 'trilleruser':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/triller/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.followers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.avatar);
                        updateCounts.banner(data.banner);
                        updateCounts.count(data.followers);
                        if (data.isVerified == true) {
                            updateCounts.name(`${data.username} ${socialBadges.verified}`);
                        } else {
                            updateCounts.name(`${data.username}`);
                        }
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
            break;
        case 'tiktokfollowers':
            $.ajax(`https://api-v2.nextcounts.com/api/tiktok/user/${user}`)
            .done(function (dataaa) {
                let dataa = JSON.parse(dataaa);
                if(!dataa.error) {
                    if(hasLoadedBefore == false) {
                        new Odometer({
                            el: document.getElementById("mainOdometer"),
                            value: dataa.followers,
                            format: '(,ddd).dd',
                        });
                    }
                    hasLoadedBefore = true;
                    updateCounts.pfp(dataa.avatar);
                    updateCounts.banner(null);
                    updateCounts.name(`${socialBadges.tiktok} ${dataa.username}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/tiktok/user/stats/${dataa.uid}`)
                        .done(function (data) {
                            if(!data.error) {
                                updateCounts.count(data.followers);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2000);
                } else {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
            break;
        case 'tiktokhearts':
            $.ajax(`https://api-v2.nextcounts.com/api/tiktok/user/${user}`)
            .done(function (dataaa) {
                let dataa = JSON.parse(dataaa);
                if(!dataa.error) {
                    if(hasLoadedBefore == false) {
                        new Odometer({
                            el: document.getElementById("mainOdometer"),
                            value: dataa.hearts,
                            format: '(,ddd).dd',
                        });
                    }
                    hasLoadedBefore = true;
                    updateCounts.pfp(dataa.avatar);
                    updateCounts.banner(null);
                    updateCounts.name(`${socialBadges.tiktok} ${dataa.username}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/tiktok/user/stats/${dataa.uid}`)
                        .done(function (data) {
                            if(!data.error) {
                                updateCounts.count(data.hearts);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2500);
                } else {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
            break;
        case 'nextcounts':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.requests,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp("https://nextcounts.com/assets/img/logo.jpg");
                        updateCounts.banner(null);
                        updateCounts.count(data.requests);
                        updateCounts.name(`${socialBadges.nextcounts} NextCounts API v2`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
            break;
        case 'teamtrees':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/teamtrees`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.trees,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp('https://nextcounts.com/assets/img/teamtrees.png');
                        updateCounts.banner(null);
                        updateCounts.count(data.trees);
                        updateCounts.name(`#TeamTrees`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2000);
            break;
        case 'teamseas':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/teamseas`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.donated,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp('https://nextcounts.com/assets/img/teamseas.png');
                        updateCounts.banner(null);
                        updateCounts.count(data.donated);
                        updateCounts.name(`#TeamSeas`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2000);
            break;
        case 'discordserver':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/discord/server/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.membersCount,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.guild.serverImg);
                        updateCounts.banner(data.guild.serverBanner);
                        updateCounts.count(data.membersCount);
                        updateCounts.name(`${socialBadges.discord} ${data.guild.serverName}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2000);
            break;
        case 'subreddit':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/reddit/r/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.members,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.subImg);
                        updateCounts.banner(data.bannerImg);
                        updateCounts.count(data.members);
                        updateCounts.name(`${socialBadges.reddit} ${data.subreddit}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
            break;
        case 'storyfirefollowers':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/storyfire/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.followers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.userImg);
                        updateCounts.banner(null);
                        updateCounts.count(data.followers);
                        updateCounts.name(`${socialBadges.storyfire} ${data.username}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        case 'storyfireblaze':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/storyfire/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.blaze,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.userImg);
                        updateCounts.banner(null);
                        updateCounts.count(data.blaze);
                        updateCounts.name(`${socialBadges.storyfire} ${data.username}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        case 'minecraftserver':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/minecraft/server/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.onlinePlayers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.img);
                        document.getElementById('userImg').className = "border rounded"
                        updateCounts.banner(null);
                        updateCounts.count(data.onlinePlayers);
                        updateCounts.name(`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> ${data.host}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 5000);
        break;
        case 'soundclouduser':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/soundcloud/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.followers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.avatar);
                        updateCounts.banner(data.banner);
                        updateCounts.count(data.followers);
                        updateCounts.name(`${socialBadges.soundcloud} ${data.username}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        case 'soundcloudplays':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/soundcloud/track/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.plays,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.artwork);
                        document.getElementById('userImg').className = "border rounded"
                        updateCounts.banner(null);
                        updateCounts.count(data.plays);
                        updateCounts.name(`${socialBadges.soundcloud} ${data.title}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        case 'soundcloudlikes':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/soundcloud/track/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.likes,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.artwork);
                        document.getElementById('userImg').className = "border rounded"
                        updateCounts.banner(null);
                        updateCounts.count(data.likes);
                        updateCounts.name(`${socialBadges.soundcloud} ${data.title}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        case 'twitchviewers':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/twitch/stream/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.liveViewers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.streamPreview.medium);
                        document.getElementById('userImg').className = "border rounded";
                        document.getElementById('userImg').style.maxWidth = "135px";
                        document.getElementById('userImg').style.width = "135px";
                        updateCounts.banner(data.streamer.streamBanner);
                        updateCounts.count(data.liveViewers);
                        updateCounts.name(`${socialBadges.twitch} ${data.streamName}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 5000);
        break;
        case 'ytvideoviews':
            $.ajax(`https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`)
            .done(function (dataaa) {
                if(!dataaa.error) {
                    let dataa = dataaa.results[0];
                    updateCounts.pfp(dataa.thumbnails.medium.url);
                    document.getElementById('userImg').className = "border rounded";
                    document.getElementById('userImg').style.maxWidth = "135px";
                    document.getElementById('userImg').style.width = "135px";
                    updateCounts.banner(dataa.thumbnails.medium.url);

                    updateCounts.name(`${socialBadges.youtube} ${dataa.title}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`)
                        .done(function (data) {
                            if(!data.error) {
                                if(hasLoadedBefore == false) {
                                    new Odometer({
                                        el: document.getElementById("mainOdometer"),
                                        value: data.views,
                                        format: '(,ddd).dd',
                                    });
                                }
                                hasLoadedBefore = true;
                                var views = parseInt(data.views);
                                var likes = parseInt(data.likes);
                                var localLikeCount = parseInt(localStorage.getItem('likeCount-' + user));
                                var localViewCount = parseInt(localStorage.getItem('viewCount-' + user));
                                var ratio = views / likes;
                                if (localLikeCount == undefined || localLikeCount == null) {
                                    localStorage.setItem('likeCount-' + user, likes);
                                }
                                if (localViewCount != views) {
                                    localStorage.setItem('viewCount-' + user, views);
                                    localStorage.setItem('likeCount-' + user, likes);
                                }
                                var estViewCount = Math.round(views + (likes - localLikeCount) * ratio);

                                updateCounts.count(estViewCount);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2500);
                } else {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
        break;
        case 'ytvideoviewsapi':
            $.ajax(`https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`)
            .done(function (dataaa) {
                if(!dataaa.error) {
                    let dataa = dataaa.results[0];
                    updateCounts.pfp(dataa.thumbnails.medium.url);
                    document.getElementById('userImg').className = "border rounded";
                    document.getElementById('userImg').style.maxWidth = "135px";
                    document.getElementById('userImg').style.width = "135px";
                    updateCounts.banner(dataa.thumbnails.medium.url);

                    updateCounts.name(`${socialBadges.youtube} ${dataa.title}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`)
                        .done(function (data) {
                            if(!data.error) {
                                if(hasLoadedBefore == false) {
                                    new Odometer({
                                        el: document.getElementById("mainOdometer"),
                                        value: data.views,
                                        format: '(,ddd).dd',
                                    });
                                }
                                hasLoadedBefore = true;
                                updateCounts.count(data.views);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2500);
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
        break;
        case 'ytvideolikes':
            $.ajax(`https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`)
            .done(function (dataaa) {
                if(!dataaa.error) {
                    let dataa = dataaa.results[0];
                    updateCounts.pfp(dataa.thumbnails.medium.url);
                    document.getElementById('userImg').className = "border rounded";
                    document.getElementById('userImg').style.maxWidth = "135px";
                    document.getElementById('userImg').style.width = "135px";
                    updateCounts.banner(dataa.thumbnails.medium.url);

                    updateCounts.name(`${socialBadges.youtube} ${dataa.title}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`)
                        .done(function (data) {
                            if(!data.error) {
                                if(hasLoadedBefore == false) {
                                    new Odometer({
                                        el: document.getElementById("mainOdometer"),
                                        value: data.likes,
                                        format: '(,ddd).dd',
                                    });
                                }
                                hasLoadedBefore = true;
                                updateCounts.count(data.likes);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2500);
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
        break;
        case 'ytvideodislikes':
            $.ajax(`https://api-v2.nextcounts.com/api/youtube/video/info/${user}`)
            .done(function (dataaa) {
                if(!dataaa.error) {
                    let dataa = dataaa.results[0];
                    updateCounts.pfp(dataa.thumbnails.medium.url);
                    document.getElementById('userImg').className = "border rounded";
                    document.getElementById('userImg').style.maxWidth = "135px";
                    document.getElementById('userImg').style.width = "135px";
                    updateCounts.banner(dataa.thumbnails.medium.url);

                    updateCounts.name(`${socialBadges.youtube} ${dataa.title}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`)
                        .done(function (data) {
                            if(!data.error) {
                                if(hasLoadedBefore == false) {
                                    new Odometer({
                                        el: document.getElementById("mainOdometer"),
                                        value: data.dislikes,
                                        format: '(,ddd).dd',
                                    });
                                }
                                hasLoadedBefore = true;
                                updateCounts.count(data.dislikes);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2500);
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
        break;
        case 'ytvideocomments':
            $.ajax(`https://api-v2.nextcounts.com/api/youtube/videos/info/${user}`)
            .done(function (dataaa) {
                if(!dataaa.error) {
                    let dataa = dataaa.results[0];
                    updateCounts.pfp(dataa.thumbnails.medium.url);
                    document.getElementById('userImg').className = "border rounded";
                    document.getElementById('userImg').style.maxWidth = "135px";
                    document.getElementById('userImg').style.width = "135px";
                    updateCounts.banner(dataa.thumbnails.medium.url);

                    updateCounts.name(`${socialBadges.youtube} ${dataa.title}`);

                    setInterval(function() {
                        $.ajax(`https://api-v2.nextcounts.com/api/youtube/video/stats/${user}`)
                        .done(function (data) {
                            if(!data.error) {
                                if(hasLoadedBefore == false) {
                                    new Odometer({
                                        el: document.getElementById("mainOdometer"),
                                        value: data.comments,
                                        format: '(,ddd).dd',
                                    });
                                }
                                hasLoadedBefore = true;
                                updateCounts.count(data.comments);
                            }
                        })
                        .fail(function () {
                            if(hasLoadedBefore == false) {
                                updateCounts.name(`${socialBadges.error} Something went wrong.`);
                            }
                        });
                    }, 2500);
                }
            })
            .fail(function () {
                if(hasLoadedBefore == false) {
                    updateCounts.name(`${socialBadges.error} Something went wrong.`);
                }
            });
        break;
        case 'ytsubcount':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/youtube/channel/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.subcount,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.userImg);
                        updateCounts.banner(data.userBanner);
                        updateCounts.count(data.subcount);
                        updateCounts.name(`${socialBadges.youtube} ${data.username}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 5000);
        break;
        case 'ytviewcount':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/youtube/channel/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.viewcount,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.userImg);
                        updateCounts.banner(data.userBanner);
                        updateCounts.count(data.viewcount);
                        updateCounts.name(`${socialBadges.youtube} ${data.username}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 5000);
        break;
        case 'ytsubcountmixerno':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/youtube/channel/estimate/mixerno/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.estimatedSubCount,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.avatar);
                        updateCounts.banner(data.banner);
                        updateCounts.count(data.estimatedSubCount);
                        updateCounts.name(`${socialBadges.youtube} ${data.channelName}`);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        case 'brimefollowers':
            setInterval(function() {
                $.ajax(`https://api-v2.nextcounts.com/api/brime/user/${user}`)
                .done(function (data) {
                    if(!data.error) {
                        if(hasLoadedBefore == false) {
                            new Odometer({
                                el: document.getElementById("mainOdometer"),
                                value: data.followers,
                                format: '(,ddd).dd',
                            });
                        }
                        hasLoadedBefore = true;
                        updateCounts.pfp(data.avatar);
                        updateCounts.banner(null);
                        updateCounts.count(data.followers);
                        updateCounts.name(data.username);
                    } else {
                        if(hasLoadedBefore == false) {
                            updateCounts.name(`${socialBadges.error} Something went wrong.`);
                        }
                    }
                })
                .fail(function () {
                    if(hasLoadedBefore == false) {
                        updateCounts.name(`${socialBadges.error} Something went wrong.`);
                    }
                });
            }, 2500);
        break;
        default:
            updateCounts.name(`${socialBadges.error} This doesn't seem to be a valid platform`);
            updateCounts.count(`Refresing the page...`);
            break;
    }
}