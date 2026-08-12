'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { day: 'L 20', count: 6 },
  { day: 'M 21', count: 9 },
  { day: 'Me 22', count: 7 },
  { day: 'J 23', count: 11 },
  { day: 'V 24', count: 8 },
  { day: 'L 27', count: 5 },
  { day: 'M 28', count: 10 },
  { day: 'Me 29', count: 12 },
  { day: 'J 30', count: 8 },
  { day: 'V 31', count: 9 },
  { day: 'L 3', count: 7 },
  { day: 'M 4', count: 11 },
  { day: 'Me 5', count: 9 },
  { day: 'J 6', count: 13 },
  { day: 'V 7', count: 8 },
  { day: 'L 10', count: 3 },
];

export default function ConsultChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={14}>
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px' }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
          formatter={(v: number) => [`${v} consultations`, '']}
        />
        {data.map((entry, i) => (
          <Cell key={`bar-cell-${i}`} fill={i === data.length - 1 ? 'var(--shifa-blue)' : 'var(--shifa-blue)'} fillOpacity={i === data.length - 1 ? 1 : 0.45} />
        ))}
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill="var(--shifa-blue)" fillOpacity={i === data.length - 1 ? 1 : 0.45} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}