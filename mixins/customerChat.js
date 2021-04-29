let shown = true
let source = null

function canChangeState(newSource, show) {
    return (source === null || source === newSource) && shown !== show
}

function updateState (newSource, show) {
    if (source === null) {
        source = newSource
        shown = show

        return
    }

    if (source === newSource) {
        source = null
        shown = show

        return
    }
}

export default  {
    methods: {
        showCustomerChat(source) {
            this.toggleCustomerChat(source, true)
        },
        hideCustomerChat(source) {
            this.toggleCustomerChat(source, false)
        },
        toggleCustomerChat(source, show = null) {
            if (canChangeState(source, (show === null ? !shown : show))) {
                if (!shown) {
                    window?.FB?.CustomerChat?.show(false)
                } else {
                    window?.FB?.CustomerChat?.hide()
                }
                
                updateState(source, !shown)
            }
        }
    }
}
