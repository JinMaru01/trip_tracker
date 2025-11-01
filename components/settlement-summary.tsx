"use client"

import { Card } from "@/components/ui/card"

export function SettlementSummary({ expenses, members }: any) {
  const calculateSettlements = () => {
    const balances: Record<string, number> = {}
    members.forEach((m: string) => {
      balances[m] = 0
    })

    expenses.forEach((expense: any) => {
      const sharedMembers = Object.keys(expense.shares).filter((m) => expense.shares[m])
      const shareAmount = expense.amount / sharedMembers.length

      balances[expense.paidBy] += expense.amount

      sharedMembers.forEach((member: string) => {
        balances[member] -= shareAmount
      })
    })

    return balances
  }

  const balances = calculateSettlements()
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Total Expenses</span>
            <span className="text-2xl font-bold text-primary">${totalExpenses.toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted-foreground">Expenses recorded: {expenses.length}</div>
          <div className="text-sm text-muted-foreground">Members: {members.length}</div>
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="mb-4 font-semibold text-foreground">Balances</h3>
        <div className="space-y-3">
          {members.map((member: string) => {
            const balance = balances[member]
            const isPositive = balance > 0
            return (
              <div key={member} className="flex justify-between items-center text-sm">
                <span className="text-foreground">{member}</span>
                <span
                  className={`font-semibold ${
                    isPositive ? "text-green-600" : balance < 0 ? "text-orange-600" : "text-muted-foreground"
                  }`}
                >
                  {isPositive ? "+" : ""} ${balance.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="bg-accent/10 border-border p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">💡 Tip:</span> Positive amounts mean someone paid more than
          their share. Negative amounts mean someone owes money.
        </p>
      </Card>
    </div>
  )
}
