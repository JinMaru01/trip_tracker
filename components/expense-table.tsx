"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ExpenseTable({ expenses, members, onDeleteExpense, onUpdateExpense }: any) {
  return (
    <Card className="border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Who Paid</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              {members.map((member: string) => (
                <th key={member} className="px-4 py-3 text-center text-sm font-semibold">
                  {member}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={members.length + 4} className="px-4 py-8 text-center text-muted-foreground">
                  No expenses yet. Add one to get started!
                </td>
              </tr>
            ) : (
              expenses.map((expense: any, idx: number) => (
                <tr key={expense.id} className="border-t border-border hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{expense.paidBy}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{expense.category}</td>
                  {members.map((member: string) => (
                    <td key={`${expense.id}-${member}`} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={expense.shares[member]}
                        onChange={(e) => {
                          const newShares = { ...expense.shares, [member]: e.target.checked }
                          onUpdateExpense(expense.id, { shares: newShares })
                        }}
                        className="rounded accent-primary cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => onDeleteExpense(expense.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      ✕
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
