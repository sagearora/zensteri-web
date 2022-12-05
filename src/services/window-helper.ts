import { ZsMessageChannel } from "../ZsMessageChannel"

export const goFullscreen = () => {
    window.electron.ipcRenderer.invoke('zs-message', [
        ZsMessageChannel.SetFullscreen, true,
    ])
}

export const goTrayWindow = () => {
    window.electron.ipcRenderer.invoke('zs-message', [
        ZsMessageChannel.SetFullscreen, false,
    ])
    window.electron.ipcRenderer.invoke('zs-message', [
        ZsMessageChannel.SetAlwaysOnTop, true,
    ])
    window.electron.ipcRenderer.invoke('zs-message', [
        ZsMessageChannel.SetSize, 200, 100
    ])
    window.electron.ipcRenderer.invoke('zs-message', [
        ZsMessageChannel.SetPosition, 'bottom-right',
    ])
}

export const goCenterRightWindow = () => {
    window.electron.ipcRenderer.invoke('zs-message', [
        ZsMessageChannel.SetAlwaysOnTop, true,
    ])
    window.electron.ipcRenderer.invoke('zs-message', [ZsMessageChannel.SetSize, 500, 600])
    window.electron.ipcRenderer.invoke('zs-message', [ZsMessageChannel.SetPosition, 'center-right'])
}