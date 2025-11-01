"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function ExpenseForm({ members, onAddExpense }: any) {
  const [formData, setFormData] = useState({
    amount: "",
    paidBy: members[0],
    category: "",
  })

  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>(
    members.reduce((acc: any, m: string) => ({ ...acc, [m]: false }), {}),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.category || !Object.values(selectedMembers).some((v) => v)) {
      alert("Please fill in all fields and select at least one member")
      return
    }

    onAddExpense({
      amount: Number.parseFloat(formData.amount),
      paidBy: formData.paidBy,
      category: formData.category,
      shares: selectedMembers,
    })

    setFormData({ amount: "", paidBy: members[0], category: "" })
    setSelectedMembers(members.reduce((acc: any, m: string) => ({ ...acc, [m]: false }), {}))
  }

  return (
    <Card className="bg-card border-border p-6">
      <h2 className="mb-4 text-xl font-semibold text-foreground">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Amount ($)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="bg-background border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Paid By</label>
            <select
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            >
              {members.map((m: string) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Hotel, Transportation, Meals"
            className="bg-background border-border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Split Among</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {members.map((member: string) => (
              <label key={member} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMembers[member]}
                  onChange={(e) => setSelectedMembers({ ...selectedMembers, [member]: e.target.checked })}
                  className="rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">{member}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Add Expense
        </Button>
      </form>
    </Card>
  )
}
