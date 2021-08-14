/*
**File created at November 1st, 2020 at 01:16AM
**
**Current version of NextCounts as I'm writing this:
**Public Version: v1.01.0012
**Insiders Version: v1.01.0069
**Internal Version being worked on rn: v2.00.000012
*/

/*
**The function below is the one responsible for making the cards on the Index page move around nicely in your screen. Maybe this will look like complete shit, who knows!? // v2.00.000012
**
**Update: welp guess what? it was a big failure. I wasnt able to get it working and, tbh, it was just
**a small cosmetic thing. Might leave a url for a gif of it working but, thats it lol: 
*/

//youtube thingy for increase its logo

const ytCard = document.querySelector('.ytCard');
const ytLogo = document.querySelector('.logoYT');


ytCard.addEventListener('mouseenter', (e) => {
    ytLogo.style.width = `12.5rem`;
    ytLogo.style.height = `12.5rem`;
});

ytCard.addEventListener('mouseleave', (e) => {
    ytLogo.style.width = `10rem`;
    ytLogo.style.height = `10rem`;
});

//same thing but twitter

const twitterCard = document.querySelector('.twitterCard');
const twitterLogo = document.querySelector('.logoTwitter');


twitterCard.addEventListener('mouseenter', (e) => {
    twitterLogo.style.width = `12.5rem`;
    twitterLogo.style.height = `12.5rem`;
});

twitterCard.addEventListener('mouseleave', (e) => {
    twitterLogo.style.width = `10rem`;
    twitterLogo.style.height = `10rem`;
});

//same thing but twitch

const twitchCard = document.querySelector('.twitchCard');
const twitchLogo = document.querySelector('.logoTwitch');


twitchCard.addEventListener('mouseenter', (e) => {
    twitchLogo.style.width = `12.5rem`;
    twitchLogo.style.height = `12.5rem`;
});

twitchCard.addEventListener('mouseleave', (e) => {
    twitchLogo.style.width = `10rem`;
    twitchLogo.style.height = `10rem`;
});

//same thing but triller

const trillerCard = document.querySelector('.trillerCard');
const trillerLogo = document.querySelector('.logoTriller');

    trillerLogo.style.width = `10rem`;
    trillerLogo.style.height = `10rem`;

trillerCard.addEventListener('mouseenter', (e) => {
    trillerLogo.style.width = `12.5rem`;
    trillerLogo.style.height = `12.5rem`;
});

trillerCard.addEventListener('mouseleave', (e) => {
    trillerLogo.style.width = `10rem`;
    trillerLogo.style.height = `10rem`;
});

//same thing but tiktok

const tiktokCard = document.querySelector('.tiktokCard');
const tiktokLogo = document.querySelector('.logoTiktok');


tiktokCard.addEventListener('mouseenter', (e) => {
    tiktokLogo.style.width = `12.5rem`;
    tiktokLogo.style.height = `12.5rem`;
});

tiktokCard.addEventListener('mouseleave', (e) => {
    tiktokLogo.style.width = `10rem`;
    tiktokLogo.style.height = `10rem`;
});

//same thing but storyfire

const soundcloudCard = document.querySelector('.soundcloudCard');
const soundcloudLogo = document.querySelector('.logoSoundcloud');


soundcloudCard.addEventListener('mouseenter', (e) => {
    soundcloudLogo.style.width = `12.5rem`;
    soundcloudLogo.style.height = `12.5rem`;
});

soundcloudCard.addEventListener('mouseleave', (e) => {
    soundcloudLogo.style.width = `10rem`;
    soundcloudLogo.style.height = `10rem`;
});

//same thing but instagram

const instagramCard = document.querySelector('.instagramCard');
const instagramLogo = document.querySelector('.logoInstagram');


instagramCard.addEventListener('mouseenter', (e) => {
    instagramLogo.style.width = `12.5rem`;
    instagramLogo.style.height = `12.5rem`;
});

instagramCard.addEventListener('mouseleave', (e) => {
    instagramLogo.style.width = `10rem`;
    instagramLogo.style.height = `10rem`;
});

//same thing but reddit

const redditCard = document.querySelector('.redditCard');
const redditLogo = document.querySelector('.logoReddit');


redditCard.addEventListener('mouseenter', (e) => {
    redditLogo.style.width = `12.5rem`;
    redditLogo.style.height = `12.5rem`;
});

redditCard.addEventListener('mouseleave', (e) => {
    redditLogo.style.width = `10rem`;
    redditLogo.style.height = `10rem`;
});

//same thing but discord

const discordCard = document.querySelector('.discordCard');
const discordLogo = document.querySelector('.logoDiscord');


discordCard.addEventListener('mouseenter', (e) => {
    discordLogo.style.width = `12.5rem`;
    discordLogo.style.height = `12.5rem`;
});

discordCard.addEventListener('mouseleave', (e) => {
    discordLogo.style.width = `10rem`;
    discordLogo.style.height = `10rem`;
});


function unlockDbgFeatures() {
    //TODO: add the stuff that i saved in a notepad
}

if(localStorage.getItem(`debugMode`) == 1){
    console.log('%c' + 'NextCounts Fire Mode', 'font-family:Comic Sans MS; font-size:50px; font-weight:bold; background: linear-gradient(#f00, yellow); border-radius: 5px; padding: 20px');
    //console.log('%cNC Debug Mode', 'font-size: 30px; color: red;');
    console.log("Debug Mode is Enabled. - Feature added by mainlab.20022021-1628");
    console.log("Current Version of Debug Mode:  mainlab.20022021-1913");
    unlockDbgFeatures();
}