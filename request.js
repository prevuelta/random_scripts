function Request (type, url, data, cb) {
    let fullUrl = `${location.protocol}//${location.hostname}${location.port?':'+location.port:''}${url}`;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200)
            cb(xhr.responseText);
    }
    xhr.open(type, fullUrl, true); // true for asynchronous
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}