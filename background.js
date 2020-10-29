// Default to enabled
chrome.runtime.onInstalled.addListener(function() {
    chrome.browserAction.setBadgeText({text: "on"});
    chrome.browserAction.setBadgeBackgroundColor({color: "#d19900"});
    chrome.storage.sync.set({enabled: true}, function() {
        console.log("ok Green time");
    });
});

// Site blacklist
blacklist = [
    "twitter.com",
    "www.twitter.com",
    "netflix.com",
    "www.netflix.com",
    "youtube.com",
    "www.youtube.com",
    "twitch.tv",
    "www.twitch.tv"
]

// File and audio setup
let files = ["brown.mp3", "dive.mp3", "mario.mp3", "morning.mp3", "war.mp3"];
document.write('<audio id="alarm">')
let audio = document.getElementById('alarm');
audio.loop = true;

pause = (from) => {
    console.log('stop it from ' + from);
    audio.pause();
}
tryPlay = (from) => {
    console.log("trying to play from " + from);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url) {
            let url = new URL(tabs[0].url);
            let domain = url.hostname;

            // Check for distracting website
            console.log(domain);
            if (blacklist.includes(domain)) {
                    // Only plays audio if box is checked
                    chrome.storage.sync.get('enabled', function(data) {
                        if (data.enabled) {
                            let song = files[Math.floor(Math.random() * files.length)];
                            console.log('playin '+song+' from ' + from);
                            audio.src = "./audio/" + song;
                            audio.play();
                        }
                    });
            } else {
                pause(from);
            }
        } else {
            console.log("bad URL from " + from);
        }
    });
};

// On tab switch
chrome.tabs.onActivated.addListener(function(tabId, windowid) {
    tryPlay("onActivated");
});
// On URL change
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete")
        tryPlay("onUpdated");
});

// Stop on window close
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    pause("onRemoved");
});


// Force pause on box uncheck
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.from == "popup") {
        if (message.message == "disabled") {
            pause("checkbox");
        } else {
            tryPlay("checkbox");
        }
    }
});
