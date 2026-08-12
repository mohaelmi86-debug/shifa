'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'L', bp: 118, pulse: 70 },
  { day: 'M', bp: 122, pulse: 74 },
  { day: 'Me', bp: 119, pulse: 71 },
  { day: 'J', bp: 125, pulse: 76 },
  { day: 'V', bp: 120, pulse: 72 },
  { day: 'S', bp: 117, pulse: 69 },
  { day: 'D', bp: 121, pulse: 73 },
];

export default function VitalsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--shifa-blue)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--shifa-blue)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--shifa-red)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--shifa-red)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
        />
        <Area type="monotone" dataKey="bp" stroke="var(--shifa-blue)" strokeWidth={2} fill="url(#bpGrad)" dot={false} name="TA" />
        <Area type="monotone" dataKey="pulse" stroke="var(--shifa-red)" strokeWidth={2} fill="url(#pulseGrad)" dot={false} name="Pouls" />
      </AreaChart>
    </ResponsiveContainer>
  );
}