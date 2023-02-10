import WebSocket from 'ws'
import { bgUpdatePort, __DEV__ } from '../../const'

const hotReloadContent = () => {
    let wsClient = null
    let isReady = false
    const connectWs = () => {
        console.log(wsClient, 'content-script-Ready')
        try {
            if (wsClient === null) {
                wsClient = new WebSocket(`ws://127.0.0.1:${bgUpdatePort}/`)
                wsClient.onopen = () => {
                    isReady = true
                }
            }
        } catch (e) {
            setTimeout(connectWs, 1000)
        }
    }

    return {
        name: 'hot-reload-content',
        enforce: 'pre',
        configResolved() {
            if (__DEV__) {
                connectWs()
            }
        },
        writeBundle() {
            // 通过socket触发reload
            if (wsClient && isReady) {
                wsClient.send('UPDATE_CONTENT_SCRIPTS')
            }
        }
    }
}

export default hotReloadContent