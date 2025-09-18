import { LoginForm } from "@/AppComponents/AppLogin"

export default function LoginPage() {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-primary">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
