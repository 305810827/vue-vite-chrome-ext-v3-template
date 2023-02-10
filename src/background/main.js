chrome.action.onClicked.addListener(async tab => {
  console.log('action, tab',tab.id)
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  }
});

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log({ tab });
  return tab;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "POPUP_INIT":
      getCurrentTab().then(sendResponse);
      return true;
    default:
      break;
  }
});

// 热更新
//service_worker接收消息
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.msg == 'RELOAD') {
//     chrome.runtime.reload() //重载Chrome插件
//     sendResponse() //回传消息给content_scripts
//   }
// })
