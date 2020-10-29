checkbox = document.getElementById("enabled");

chrome.storage.sync.get('enabled', function(data) {
    checkbox.checked = data.enabled;
});

checkbox.addEventListener('change', function (event) {
    let checked = event.target.checked;
    chrome.storage.sync.set({enabled: checked}, function() {
        console.log("set enabled to " + checked);
        
        chrome.runtime.sendMessage({from: "popup", message: (checked) ? "enabled" : "disabled"});
        chrome.browserAction.setBadgeText({text: (checked) ? "on" : "off"});
        chrome.browserAction.setBadgeBackgroundColor({color: (checked) ? "#d19900" : "#7d828a"});
    });
});