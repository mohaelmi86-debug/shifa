'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { week: 'S.20', consultations: 312, admissions: 28, urgences: 45 },
  { week: 'S.21', consultations: 398, admissions: 31, urgences: 52 },
  { week: 'S.22', consultations: 445, admissions: 25, urgences: 38 },
  { week: 'S.23', consultations: 421, admissions: 34, urgences: 61 },
  { week: 'S.24', consultations: 380, admissions: 29, urgences: 44 },
  { week: 'S.25', consultations: 502, admissions: 38, urgences: 58 },
  { week: 'S.26', consultations: 467, admissions: 32, urgences: 49 },
  { week: 'S.27', consultations: 489, admissions: 35, urgences: 55 },
  { week: 'S.28', consultations: 524, admissions: 40, urgences: 63 },
  { week: 'S.29', consultations: 441, admissions: 30, urgences: 47 },
  { week: 'S.30', consultations: 510, admissions: 36, urgences: 54 },
  { week: 'S.31', consultations: 487, admissions: 33, urgences: 50 },
  { week: 'S.32', consultations: 462, admissions: 28, urgences: 42 },
];

export default function AdminActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="consultGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--shifa-blue)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--shifa-blue)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--shifa-green)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--shifa-green)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="urgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--shifa-red)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--shifa-red)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px' }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
        />
        <Area type="monotone" dataKey="consultations" stroke="var(--shifa-blue)" strokeWidth={2} fill="url(#consultGrad)" name="Consultations" />
        <Area type="monotone" dataKey="admissions" stroke="var(--shifa-green)" strokeWidth={2} fill="url(#admGrad)" name="Admissions" />
        <Area type="monotone" dataKey="urgences" stroke="var(--shifa-red)" strokeWidth={2} fill="url(#urgGrad)" name="Urgences" />
      </AreaChart>
    </ResponsiveContainer>
  );
}