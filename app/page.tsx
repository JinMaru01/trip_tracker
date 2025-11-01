"use client"

import { useState } from "react"
import { ExpenseTable } from "@/components/expense-table"
import { ExpenseForm } from "@/components/expense-form"
import { SettlementSummary } from "@/components/settlement-summary"

export default function Home() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 45,
      paidBy: "Darachin",
      category: "Hotel Booking (50%)",
      shares: { Sovann: false, Visai: false, Darachin: true, Davann: false, Yongyi: false },
    },
    {
      id: 2,
      amount: 50,
      paidBy: "Visai",
      category: "Bus Booking (SR-PP)",
      shares: { Sovann: true, Visai: true, Darachin: true, Davann: false, Yongyi: false },
    },
  ])

  const members = ["Sovann", "Visai", "Darachin", "Davann", "Yongyi"]

  const handleAddExpense = (newExpense: any) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now() }])
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleUpdateExpense = (id: number, updates: any) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Trip Expense Tracker</h1>
          <p className="text-muted-foreground">Keep track of shared expenses and split costs fairly</p>
        </div>

        {/* Main Layout */}
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
    </main>
  )
}
