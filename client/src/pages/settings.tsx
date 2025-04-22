import { useState, useEffect } from "react";
import { useUser } from "../hooks/use-user";
import type { SelectUser } from "../types/schema";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<SelectUser> & {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
    };
    privacy: {
      publicProfile: boolean;
      shareJournals: boolean;
    };
  }>({
    firstName: "",
    lastName: "",
    email: "",
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      reminders: true
    },
    privacy: {
      publicProfile: false,
      shareJournals: false
    }
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast({
        title: "Success",
        description: "Your settings have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6b8aaf]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#6b8aaf] hover:bg-[#5a769c]"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize your app appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'system' }))}
                className="px-3 py-2 rounded-md border"
                aria-label="Theme preference"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotif">Email Notifications</Label>
              <input
                type="checkbox"
                id="emailNotif"
                checked={formData.notifications.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
                className="h-4 w-4"
                aria-label="Enable email notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotif">Push Notifications</Label>
              <input
                type="checkbox"
                id="pushNotif"
                checked={formData.notifications.push}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: e.target.checked }
                }))}
                className="h-4 w-4"
                aria-label="Enable push notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminders">Daily Reminders</Label>
              <input
                type="checkbox"
                id="reminders"
                checked={formData.notifications.reminders}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, reminders: e.target.checked }
                }))}
                className="h-4 w-4"
                aria-label="Enable daily reminders"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your privacy preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="publicProfile">Public Profile</Label>
              <input
                type="checkbox"
                id="publicProfile"
                checked={formData.privacy.publicProfile}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, publicProfile: e.target.checked }
                }))}
                className="h-4 w-4"
                aria-label="Make profile public"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shareJournals">Share Journals</Label>
              <input
                type="checkbox"
                id="shareJournals"
                checked={formData.privacy.shareJournals}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, shareJournals: e.target.checked }
                }))}
                className="h-4 w-4"
                aria-label="Allow journal sharing"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
