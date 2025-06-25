import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function UsageChart() {
  // Mock data for the last 7 days
  const data = [
    { day: 'Mon', requests: 45 },
    { day: 'Tue', requests: 78 },
    { day: 'Wed', requests: 123 },
    { day: 'Thu', requests: 89 },
    { day: 'Fri', requests: 156 },
    { day: 'Sat', requests: 134 },
    { day: 'Sun', requests: 67 }
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
