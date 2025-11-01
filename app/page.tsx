import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExpenseTracker } from "@/components/expense-tracker"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: trips } = await supabase
    .from("trips")
    .select("id, name, description")
    .eq("created_by", user.id)
    .limit(1)

  let tripId = trips?.[0]?.id

  if (!tripId) {
    const { data: newTrip } = await supabase
      .from("trips")
      .insert({
        name: "My Trip",
        description: "Shared expense tracker",
        created_by: user.id,
      })
      .select("id")
      .single()

    tripId = newTrip?.id
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-foreground">Trip Expense Tracker</h1>
          <p className="text-muted-foreground">Keep track of shared expenses and split costs fairly</p>
        </div>

        {/* Expense Tracker Component */}
        {tripId && <ExpenseTracker tripId={tripId} userId={user.id} />}
      </div>
    </main>
  )
}
