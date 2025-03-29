"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, ExternalLink } from "lucide-react"

export default function DomainConfig() {
  const [copied, setCopied] = useState(false)
  const [domain, setDomain] = useState("imageoptimizer.com")
  const [customDomain, setCustomDomain] = useState("")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Domain Configuration</h1>

      <Tabs defaultValue="vercel">
        <TabsList className="mb-6">
          <TabsTrigger value="vercel">Vercel Deployment</TabsTrigger>
          <TabsTrigger value="custom">Custom Domain</TabsTrigger>
        </TabsList>

        <TabsContent value="vercel">
          <Card>
            <CardHeader>
              <CardTitle>Deploy to Vercel</CardTitle>
              <CardDescription>Deploy your ImageOptimizer website to Vercel with one click</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Vercel provides the easiest way to deploy your Next.js application. You'll get:</p>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>Automatic HTTPS</li>
                <li>Global CDN</li>
                <li>Continuous deployment from Git</li>
                <li>Preview deployments for pull requests</li>
                <li>Custom domains</li>
              </ul>

              <div className="flex flex-col md:flex-row gap-4">
                <Button className="flex items-center gap-2" asChild>
                  <a
                    href="https://vercel.com/new/clone?repository-url=https://github.com/saimamir/image-optimizer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg height="16" viewBox="0 0 116 100" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0z" />
                    </svg>
                    Deploy to Vercel
                  </a>
                </Button>

                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://github.com/saimamir/image-optimizer" target="_blank" rel="noopener noreferrer">
                    <svg height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Setup</CardTitle>
              <CardDescription>Configure your own domain for ImageOptimizer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Enter your domain</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="example.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                    <Button onClick={() => setDomain(customDomain || "imageoptimizer.com")} disabled={!customDomain}>
                      Set Domain
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">DNS Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add these records to your DNS configuration:</p>

                  <div className="bg-muted p-3 rounded-md mb-4 relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`Type: A
Name: @
Value: 76.76.21.21
TTL: 3600`}
                      </code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard("Type: A\nName: @\nValue: 76.76.21.21\nTTL: 3600")}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="bg-muted p-3 rounded-md relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: 3600`}
                      </code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard("Type: CNAME\nName: www\nValue: cname.vercel-dns.com.\nTTL: 3600")}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Your Website URL</h3>
                  <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
                    <span className="text-sm font-mono">https://{domain}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`https://${domain}`)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

