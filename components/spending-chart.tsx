"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface SpendingData {
  name: string
  value: number
  color: string
}

interface SpendingChartProps {
  data: SpendingData[]
}

export function SpendingChart({ data }: SpendingChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-xl bg-white/95 backdrop-blur-sm border border-white/60 p-3 shadow-xl z-50">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: data.color }} />
            <span className="font-semibold text-gray-800">{data.name}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">${data.value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[200px] w-full bg-white/20 rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="white"
                strokeWidth={2}
                className="hover:opacity-80 transition-all duration-200 cursor-pointer drop-shadow-sm hover:drop-shadow-md"
                style={{
                  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} wrapperStyle={{ outline: "none" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
