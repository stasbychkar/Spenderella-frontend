"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function SpendingPieChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-blue-100 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-semibold text-blue-900">{data.name}</span>
          </div>
          <p className="mt-1 text-sm text-blue-600">
            ${data.value.toFixed(2)} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="white"
                strokeWidth={2}
                className="transition-all hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
