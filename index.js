const { resolve } = require('path')
const { Plugin } = require('powercord/entities')
const { getModuleByDisplayName, React } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')
const { Button } = require('powercord/components/ContextMenu')
const { open } = require('powercord/modal')

const Modal = require('./Modal')

module.exports = class ViewRaw extends Plugin {
    async startPlugin() {
        this.loadCSS(resolve(__dirname, 'style.css'))

        const MessageDeveloperModeGroup = await getModuleByDisplayName('FluxContainer(MessageDeveloperModeGroup)')
        inject('viewraw', MessageDeveloperModeGroup.prototype, 'render', (_, res) => {
            const r = [
                React.createElement(Button, {
                    name: 'View raw',
                    separate: true,
                    disabled: res.props.message.content == '',
                    onClick: () => open(() => React.createElement(Modal, { message: res.props.message }))
                }), res
            ]
            r.props = res.props
            return r
        })
    }

    pluginWillUnload() {
        uninject('viewraw')
    }
}
