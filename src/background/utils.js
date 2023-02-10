export const onMessage = (taskId, callback) => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { params } = request
        if (request.taskId === taskId) {
            const result = callback(params)
            if (result && result.then) {
                result.then((info) => {
                    sendResponse(info)
                })
            } else {
                sendResponse(result)
            }
        }
        return true
    })
}

export const sendMessage = (taskId, params) => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            {
                taskId,
                params
            },
            (result) => {
                resolve(result)
            }
        )
    })
}