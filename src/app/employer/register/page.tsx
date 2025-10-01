"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useEmployerRegistration } from "@/app/employer/hooks/useEmployerRegistration"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EmployerRegister() {
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [country, setCountry] = useState("")
  const [foundationDate, setFoundationDate] = useState("")
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")

  const router = useRouter()
  const { status } = useSession()

  const { mutate, isPending, isSuccess, error } = useEmployerRegistration()

  useEffect(() => {
    if (isSuccess) {
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then((result) => {
        if (result?.error) {
          console.error("Auto-login after registration failed:", result.error)
          router.push("/employer/login?error=AutoLoginFailed")
        } else if (result?.ok) {
          console.log("Auto-login after registration successful.")
        }
      })
    }
  }, [isSuccess, email, password, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      company_name: companyName,
      email,
      password,
      phone_number: phoneNumber,
      country,
      foundation_date: foundationDate,
      industry,
      size,
      description,
      address,
      website,
    })
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-balance">Create your employer account</h1>
          <p className="text-muted-foreground text-pretty">
            Join our platform to find the best talent for your company
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl">Company Information</CardTitle>
            <CardDescription>
              Fields marked with <span className="text-destructive">*</span> are required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields Section */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="companyName" className="text-sm font-medium">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Optional Information</span>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foundationDate" className="text-sm font-medium">
                      Foundation Date
                    </Label>
                    <Input
                      id="foundationDate"
                      type="date"
                      value={foundationDate}
                      onChange={(e) => setFoundationDate(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-medium">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="Technology"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium">
                      Company Size
                    </Label>
                    <Input
                      id="size"
                      type="text"
                      placeholder="1-10, 11-50, 51-200, etc."
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://company.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Business St, City, State, ZIP"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Company Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your company, mission, and culture..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={isPending} className="h-11 w-full text-base font-medium" size="lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/employer/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
