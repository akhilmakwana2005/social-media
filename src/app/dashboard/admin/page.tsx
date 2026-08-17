import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent } from '@/components/ui/Card';
import { ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  return (
    <DashboardShell title="Admin Console">
      <div className="max-w-4xl mx-auto py-12">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <ShieldCheck className="w-16 h-16 mb-4 text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Admin Console</h2>
            <p className="text-sm max-w-md">Platform administration area for system management and global configurations.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
