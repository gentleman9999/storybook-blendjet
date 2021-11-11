let shown = true
let source = null

function canChangeState(newSource, show) {
    return (source === null || source === newSource) && shown !== show
}

function updateState(newSource, show) {
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

export default {
    methods: {
        showOptimonkPopup() {
            this.toggleOptimonkPopup(source, true)
        },
        hideOptimonkPopup() {
            this.toggleOptimonkPopup(source, false)
        },
        toggleOptimonkPopup(source, show = null) {
            if (canChangeState(source, (show === null ? !shown : show))) {
                try {
                    const adapter = window.OptiMonk.Visitor.createAdapter()
                    adapter.attr('hidePopup', String(!!shown))

                    updateState(source, show)
                } catch (error) {
                    console.error('There is no Optimonk campaign enabled.')
                }
            }
        }
    }
}