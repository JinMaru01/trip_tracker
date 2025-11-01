"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ExpenseTable } from "@/components/expense-table"
import { ExpenseForm } from "@/components/expense-form"
import { SettlementSummary } from "@/components/settlement-summary"

interface Expense {
  id: string
  amount: number
  paidBy: string
  category: string
  shares: Record<string, boolean>
}

interface ExpenseTrackerProps {
  tripId: string
  userId: string
}

export function ExpenseTracker({ tripId, userId }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [members, setMembers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [tripId])

  const fetchData = async () => {
    try {
      // Fetch trip members
      const { data: membersData } = await supabase.from("trip_members").select("user_name").eq("trip_id", tripId)

      const memberNames = membersData?.map((m: any) => m.user_name) || []
      setMembers(memberNames)

      // Fetch expenses with their shares
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false })

      // Build expense objects with shares
      const expensesWithShares = await Promise.all(
        (expensesData || []).map(async (exp: any) => {
          const { data: sharesData } = await supabase
            .from("expense_shares")
            .select("member_name")
            .eq("expense_id", exp.id)

          const shares: Record<string, boolean> = {}
          memberNames.forEach((name: string) => {
            shares[name] = sharesData?.some((s: any) => s.member_name === name) || false
          })

          return {
            id: exp.id,
            amount: exp.amount,
            paidBy: exp.paid_by,
            category: exp.category,
            shares,
          }
        }),
      )

      setExpenses(expensesWithShares)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (newExpense: any) => {
    try {
      // Insert expense
      const { data: expenseData } = await supabase
        .from("expenses")
        .insert({
          trip_id: tripId,
          amount: newExpense.amount,
          paid_by: newExpense.paidBy,
          category: newExpense.category,
        })
        .select()
        .single()

      // Insert expense shares
      if (expenseData) {
        const sharesToInsert = Object.entries(newExpense.shares)
          .filter(([_, shared]: [string, boolean]) => shared)
          .map(([memberName]: [string, boolean]) => ({
            expense_id: expenseData.id,
            member_name: memberName,
          }))

        if (sharesToInsert.length > 0) {
          await supabase.from("expense_shares").insert(sharesToInsert)
        }
      }

      // Refresh data
      fetchData()
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await supabase.from("expenses").delete().eq("id", id)
      fetchData()
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const handleUpdateExpense = async (id: string, updates: any) => {
    try {
      // Update expense
      await supabase
        .from("expenses")
        .update({
          amount: updates.amount,
          paid_by: updates.paidBy,
          category: updates.category,
        })
        .eq("id", id)

      // Delete old shares and insert new ones
      await supabase.from("expense_shares").delete().eq("expense_id", id)

      const sharesToInsert = Object.entries(updates.shares)
        .filter(([_, shared]: [string, boolean]) => shared)
        .map(([memberName]: [string, boolean]) => ({
          expense_id: id,
          member_name: memberName,
        }))

      if (sharesToInsert.length > 0) {
        await supabase.from("expense_shares").insert(sharesToInsert)
      }

      fetchData()
    } catch (error) {
      console.error("Error updating expense:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading expenses...</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Form and Table */}
        <div className="lg:col-span-2 space-y-6">
          <ExpenseForm members={members} onAddExpense={handleAddExpense} />
          <ExpenseTable
            expenses={expenses}
            members={members}
            onDeleteExpense={handleDeleteExpense}
            onUpdateExpense={handleUpdateExpense}
          />
        </div>

        {/* Right Column - Summary */}
        <div>
          <SettlementSummary expenses={expenses} members={members} />
        </div>
      </div>
    </div>
  )
}
