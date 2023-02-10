import { WebSocketServer } from 'ws'
import { bgUpdatePort, __DEV__ } from '../../const'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const hotReloadBackground = () => {

    let wss = null

    const initSocket = () => {
        wss = new WebSocketServer({port: bgUpdatePort})


        wss.on('connection', function connection(ws) {
            console.log('connection')
            // 启动心跳监听， 方便重连
            ws.send('heartbeatMonitor')

            const interval = setInterval(() => {
                ws.send('heartbeat')
            }, 3000);

            ws.on('message', (message) => {
                console.log('UPDATE_CONTENT_SCRIPTS')
                const info = `${message}`
                // 监听contentScript代码变化，复用一个ws连接
                if (info === 'UPDATE_CONTENT_SCRIPTS') {
                    wss.clients.forEach((ws) => {
                        ws.send('UPDATE_CONTENT_SCRIPTS')
                    })
                }
            })


            // 关闭通道
            ws.on('close', () => {
                clearInterval(interval);
            })
        })
    }


    // vite plugin 配置
    return {
        name: 'hot-reload-background',
        enforce: 'pre',
        configResolved(config) {
            // 启动 websocket服务
            if (__DEV__) {
                initSocket()
            }
        },
        transform(code, id) {
            if (id.indexOf('background/main.js') > 0 && __DEV__) {
                let injectDevCode = `\nconst UP_PORT = ${bgUpdatePort}\n`
                injectDevCode += readFileSync(resolve(__dirname, 'injectCode.js'), 'utf-8')
                // console.log(code + injectDevCode)
                return code + injectDevCode
            }
        },
        writeBundle() {
            // 通过socket触发reload
            if (wss !== null) {
                wss.clients.forEach((ws) => {
                    console.log('UPDATE_BG ,send')
                    ws.send('UPDATE_BG')
                })
            }
        }
    }
}

export default hotReloadBackground