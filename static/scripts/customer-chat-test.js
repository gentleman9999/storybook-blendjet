function updateSettings() {
    try {
        const settingsString = window.localStorage.getItem('ghostmonitor_settings')

        const settings = settingsString ? window.JSON.parse(settingsString) : window.recart.settings
        settings.fb_messenger.customerChat.isEnabled = true

        window.localStorage.setItem('ghostmonitor_settings', JSON.stringify(settings))

        if (window.localStorage.getItem('recart_useLocalSettings') !== 'true') {
            window.localStorage.setItem('recart_useLocalSettings', 'true')
            window.alert('This window is going to be reloaded to test Customer Chat')
            window.location.reload()
        }
    } catch (e) {
        console.error(e.message)
    }
}

setTimeout(function () { 
    updateSettings() 
}, 0)