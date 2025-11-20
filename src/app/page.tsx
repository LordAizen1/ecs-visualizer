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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleConnect = async () => {
    // Clear previous error
    setError("")

    // Basic check if keys are entered
    if (!accessKey || !secretKey) {
      setError("Please enter both Access Key and Secret Key.")
      return
    }

    setLoading(true)

    try {
      // Call backend validation endpoint
      const response = await fetch("/api/v1/auth/validate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key_id: accessKey,
          secret_access_key: secretKey,
        }),
      })

      if (response.ok) {
        // Credentials are valid, proceed to home
        router.push("/home")
      } else {
        // Invalid credentials
        const data = await response.json()
        setError(data.detail || "Invalid AWS credentials. Please check and try again.")
      }
    } catch (err) {
      setError("Failed to validate credentials. Please check your connection.")
    } finally {
      setLoading(false)
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
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="access-key" className="w-40">AWS Access Key ID</label>
                <Input
                  id="access-key"
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="secret-key" className="w-40">AWS Secret Key</label>
                <Input
                  id="secret-key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              NOTE: We recommend you to create a dedicated IAM user with least-privilege read-only policy.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <div className="flex space-x-2">
              <Button onClick={handleConnect} disabled={loading}>
                {loading ? "Validating..." : "Connect"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              "Your credentials are validated with AWS and not stored."
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