"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Check, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PluginInstallerProps {
  pluginId: string
  pluginName: string
  isPremium: boolean
  isInstalled: boolean
}

export function PluginInstaller({ pluginId, pluginName, isPremium, isInstalled }: PluginInstallerProps) {
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(isInstalled)

  const handleInstall = async () => {
    if (installed) return

    setInstalling(true)

    // Simulate installation process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save installed plugin to localStorage
    const installedPlugins = JSON.parse(localStorage.getItem("installed-plugins") || "[]")
    if (!installedPlugins.includes(pluginId)) {
      installedPlugins.push(pluginId)
      localStorage.setItem("installed-plugins", JSON.stringify(installedPlugins))
    }

    setInstalled(true)
    setInstalling(false)

    toast({
      title: "Plugin installed",
      description: `${pluginName} has been successfully installed.`,
    })
  }

  if (installed) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Check className="mr-2 h-4 w-4" /> Installed
      </Button>
    )
  }

  if (isPremium) {
    return (
      <Button variant="outline" className="w-full" asChild>
        <a href="/pricing">Get Premium</a>
      </Button>
    )
  }

  return (
    <Button onClick={handleInstall} disabled={installing} className="w-full">
      {installing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Installing...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" /> Install
        </>
      )}
    </Button>
  )
}

