chrome.runtime.getBackgroundPage(function(background) {
  const githubcontent = background.githubRequestData;
  const gitlabcontent = background.gitlabRequestData;
  const gitlabCustomUrl = background.gitlabCustomUrl;
  const totalRequests = githubcontent.length + gitlabcontent.length;
  chrome.browserAction.setBadgeText({ text: String(totalRequests) });

  const reviewRequest = document.getElementById('reviewRequest');
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
