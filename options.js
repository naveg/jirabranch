function save_options() {
  var prefix = document.getElementById("prefix").value;
  chrome.storage.sync.set({
    prefix: prefix
  });
}

function restore_options() {
  chrome.storage.sync.get({
    prefix: ""
  }, (opts) => {
    document.getElementById("prefix").value = opts.prefix;
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("prefix").addEventListener("input", save_options);
