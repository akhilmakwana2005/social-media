"use client";

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, Users, Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/workspaces/settings')
      .then(res => res.json())
      .then(data => {
        if (data.workspace) {
          setWorkspaceName(data.workspace.name);
          setMembers(data.workspace.memberships);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/workspaces/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: workspaceName })
      });
      alert('Workspace updated successfully!');
    } catch (e) {
      alert('Failed to update workspace.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="text-brand-indigo" /> Workspace Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your workspace preferences and team members.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading settings...</div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input defaultValue="Akhil Makwana" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input defaultValue="akhilmakwana745@gmail.com" type="email" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button>Save Profile</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={async () => {
                        alert('Sending test email... check your console if you do not have RESEND_API_KEY set!');
                        await fetch('/api/notifications/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ type: 'WELCOME' })
                        });
                      }}
                    >
                      Send Test Welcome Email
                    </Button>
                  </div>
                </form>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Workspace Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-semibold text-slate-800">{member.user.name}</p>
                        <p className="text-xs text-slate-500">{member.user.email}</p>
                      </div>
                      <div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-brand-indigo/10 text-brand-indigo rounded-md">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full border-dashed gap-2">
                    Invite Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
