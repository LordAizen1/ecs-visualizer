"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const HomePage = () => {
  const [accessKey, setAccessKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const router = useRouter()

  const handleConnect = () => {
    // Basic check if keys are entered. No real validation for development.
    if (accessKey && secretKey) {
      router.push("/cluster-map")
    } else {
      alert("Please enter both Access Key and Secret Key.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">ECS Privacy Mental Model Visualizer</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Welcome,</CardTitle>
            <CardDescription>Connect your AWS account to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="access-key" className="w-40">AWS Access Key ID</label>
                <Input
                  id="access-key"
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="secret-key" className="w-40">AWS Secret Key</label>
                <Input
                  id="secret-key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              NOTE: We recommend you to create a dedicated IAM user with least-privilege read-only policy.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <div className="flex space-x-2">
              <Button onClick={handleConnect}>Connect</Button>
              <Button variant="outline">Use Demo Dataset</Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              "Your credentials are not stored. All analysis is local."
            </p>
          </CardFooter>
        </Card>

        <Card className="mt-4">
          <CardContent className="flex justify-center items-center space-x-4 p-4">
            <Link href="/about" className="text-sm text-gray-500 hover:underline">About</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:underline">Contact</Link>
            <Link href="/help" className="text-sm text-gray-500 hover:underline">Help</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage