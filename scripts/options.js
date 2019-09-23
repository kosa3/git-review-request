// Saves options to chrome.storage
function save_options() {
  let github = document.getElementById('github').checked;
  let gitlab = document.getElementById('gitlab').checked;
  let assignee = document.getElementById('assignee').value;
  let customUrl = document.getElementById('custom_url').value;

  chrome.storage.sync.set({
    github: github,
    gitlab: gitlab,
    assignee: assignee,
    customUrl: customUrl
  }, function() {
    // Update status to let user know options were saved.
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    github: false,
    gitlab: false,
    assignee: '',
    customUrl: ''
  }, function(items) {
    let assignee = document.getElementById('assignee');
    let customUrl = document.getElementById('custom_url');

    document.getElementById('github').checked = items.github;
    document.getElementById('gitlab').checked = items.gitlab;
    if (items.gitlab) {
      assignee.disabled = false;
      customUrl.disabled = false;
    } else {
      assignee.disabled = true;
      customUrl.disabled = true;
    }

    if (items.assignee.length) {
      assignee.defaultValue = items.assignee;
      customUrl.defaultValue = items.customUrl;
    }
  });
}

document.getElementById('gitlab').addEventListener('click', function () {
  let assignee = document.getElementById('assignee');
  let customUrl = document.getElementById('custom_url');
  if (this.checked) {
    assignee.disabled = false;
    customUrl.disabled = false;
  } else {
    assignee.disabled = true;
    customUrl.disabled = true;
  }
});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
