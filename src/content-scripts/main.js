import { createApp } from "vue";
import App from "./App.vue";

const MOUNT_EL_ID = "x-extension-content-scripts";

let mountEl = document.getElementById(MOUNT_EL_ID);
if (mountEl && __DEV__) {
  document.body.removeChild(mountEl)
}

const container = document.createElement("div");
container.setAttribute("id", MOUNT_EL_ID);

const root = document.createElement('div')
const styleEl = document.createElement('link')
const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
styleEl.setAttribute('rel', 'stylesheet')
styleEl.setAttribute('href', chrome.runtime.getURL('content-scripts/style.css'))
shadowDOM.appendChild(styleEl)
shadowDOM.appendChild(root)

document.body.appendChild(container)

// el.insertAdjacentHTML(
//     'afterend',
//     '<div id="app">hello</div>',
// );
const vm = createApp(App).mount(root);

chrome.runtime.onMessage.addListener(message => {
  console.log(message.toggleVisible, 'toggleVisible')
  if (message.toggleVisible) {
    vm.visible = !vm.visible;
  }
});


