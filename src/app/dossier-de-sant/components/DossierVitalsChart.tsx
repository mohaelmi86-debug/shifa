'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Mars', bp: 118, pulse: 68 },
  { month: 'Avr', bp: 122, pulse: 72 },
  { month: 'Mai', bp: 125, pulse: 76 },
  { month: 'Juin', bp: 119, pulse: 70 },
  { month: 'Juil', bp: 121, pulse: 73 },
  { month: 'Août', bp: 120, pulse: 72 },
];

export default function DossierVitalsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} domain={[60, 140]} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
        />
        <Line type="monotone" dataKey="bp" stroke="var(--shifa-blue)" strokeWidth={2.5} dot={{ fill: 'var(--shifa-blue)', r: 4 }} name="Tension (systolique)" />
        <Line type="monotone" dataKey="pulse" stroke="var(--shifa-red)" strokeWidth={2.5} dot={{ fill: 'var(--shifa-red)', r: 4 }} name="Pouls" />
      </LineChart>
    </ResponsiveContainer>
  );
}