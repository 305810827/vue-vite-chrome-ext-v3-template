const hotReloadClientInit = () => {
    const bgWs = new WebSocket(`ws://127.0.0.1:${UP_PORT}`)
    console.log('hotReloadClientInit')
    let isAlive = true
    bgWs.addEventListener('message', (e) => {
        console.log('message')
        if (e.data === 'UPDATE_BG') {
            bgWs.close()
            setTimeout(() => {
                console.log('reload')
                chrome.runtime.reload()
            }, 500)
        } else if (e.data === 'UPDATE_CONTENT_SCRIPTS') {
            reloadContent()
        } else if (e.data === 'heartbeatMonitor') {
            isAlive = true
            const interval = setInterval(() => {
                setTimeout(() => {
                    if (!isAlive) {
                        const detectWs = new WebSocket(`ws://127.0.0.1:${UP_PORT}`)
                        detectWs.onopen = () => {
                            detectWs.close()
                            clearInterval(interval)
                            hotReloadClientInit()
                        }
                    }
                }, 500)
            }, 3000)
        } else if (e.data === 'heartbeat') {
            isAlive = true
            setTimeout(() => {
                isAlive = false
            }, 2500)
        }
    })

    const reloadContent = () => {
        console.log('reloadContent')
        chrome.tabs.query({}, (tabs) => {
            const currentTab = tabs.find((tab) => tab.active)
            console.log(currentTab, 'currentTabreloadContent')
            if (!currentTab || currentTab.url.indexOf('chrome') === 0) {
                return
            }
            const tabId = currentTab.id
            chrome.scripting.executeScript({
                target: { tabId },
                files: ['./content-scripts/main.js']
            })
        })
    }
}
hotReloadClientInit()