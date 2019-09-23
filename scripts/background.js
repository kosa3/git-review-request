const github_review_request_url = "https://github.com/pulls/review-requested";
const gitlab_review_request_url = "https://gitlab.com/dashboard/merge_requests?assignee_username=";
window.githubRequestData = [];
window.gitlabRequestData = [];
window.gitlabCustomUrl = '';
let count = 0;

const getPullRequestByUrl = (url) => {
  return fetch(url)
    .then(res => res.text())
    .then(text => new DOMParser().parseFromString(text, 'text/html'))
    .then(document => {
      let element = document.getElementsByClassName('js-active-navigation-container');
      let childlistElements = element[0].children;

      if (childlistElements.length) {
        for (let i = 0;i < childlistElements.length; i++) {
          let target = childlistElements[i].getElementsByClassName('js-navigation-open')[0];
          window.githubRequestData.push({
            link: target.getAttribute('href'),
            text: target.innerText
          })
        }
      }

      count += window.githubRequestData.length;
      chrome.browserAction.setBadgeText({ text: String(count) });
    })
};

const getMergeRequestByUrl = (url) => {
  return fetch(url)
    .then(res => res.text())
    .then(text => new DOMParser().parseFromString(text, 'text/html'))
    .then(document => {
      let elements = document.getElementsByClassName('merge-request');

      if (elements.length) {
        for (let i = 0;i < elements.length; i++) {
          let target = elements[i].getElementsByClassName('merge-request-title')[0];
          window.gitlabRequestData.push({
            link: target.getElementsByTagName('a')[0].getAttribute('href'),
            text: target.innerText
          })
        }
      }

      count += window.gitlabRequestData.length;
      chrome.browserAction.setBadgeText({ text: String(count) });
    })
}

function getReviewRequestData() {
  chrome.storage.sync.get({
    github: false,
    gitlab: false,
    assignee: '',
    customUrl: ''
  }, function(items) {
    if (items.github) {
      // request github review request
      getPullRequestByUrl(github_review_request_url);
    }

    if (items.gitlab) {
      if (items.customUrl.length) {
        // request gitlab custom url
        window.gitlabCustomUrl = items.customUrl;
        getMergeRequestByUrl(`${items.customUrl}/dashboard/merge_requests?assignee_username=${items.assignee}`);
      } else {
        // request gitlab default assignee url
        const gitlab_request_url_with_asignee = `${gitlab_review_request_url}${items.assignee}`;
        getMergeRequestByUrl(gitlab_request_url_with_asignee);
      }
    }
  });
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.value === "request") {
    // init
    window.githubRequestData = [];
    window.gitlabRequestData = [];
    count = 0;

    chrome.browserAction.setBadgeText({ text: String(count) });

    getReviewRequestData()
  }
})
