chrome.runtime.getBackgroundPage(function(background) {
  let githubcontent = background.githubRequestData;
  let gitlabcontent = background.gitlabRequestData;
  let gitlabCustomUrl = background.gitlabCustomUrl;
  let totalRequests = githubcontent.length + gitlabcontent.length;
  chrome.browserAction.setBadgeText({ text: String(totalRequests) });

  let reviewRequest = document.getElementById('reviewRequest');
  if (totalRequests) {
    reviewRequest.textContent = null;
  }
  for (let i = 0; i < githubcontent.length; i++) {
    reviewRequest.insertAdjacentHTML('afterbegin', `<li><a target="_blank" href="https://github.com${githubcontent[i].link}">${githubcontent[i].text}</a></li>`)
  }

  for (let i = 0; i < gitlabcontent.length; i++) {
    let url = 'https://gitlab.com';
    if (gitlabCustomUrl.length) {
      url = gitlabCustomUrl;
    }
    reviewRequest.insertAdjacentHTML('afterbegin', `<li><a target="_blank" href="${url}${gitlabcontent[i].link}">${gitlabcontent[i].text}</a></li>`)
  }
  return false;
});
