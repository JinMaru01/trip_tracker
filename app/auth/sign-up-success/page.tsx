import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          We've sent you a confirmation link. Please check your email and confirm your account.
        </p>
        <Link href="/auth/login">
          <Button className="w-full">Back to login</Button>
        </Link>
      </div>
    </div>
  )
}
