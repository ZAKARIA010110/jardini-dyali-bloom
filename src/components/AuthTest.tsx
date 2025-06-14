
import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';

const AuthTest = () => {
  const { user, login, signup, logout } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Test User');
  const [testNote, setTestNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await signup(email, password, name, 'homeowner');
      toast({
        title: "Success",
        description: "Account created successfully! Check your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setNotes([]);
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveNote = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_notes')
        .insert([
          {
            user_id: user.id,
            content: testNote,
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Note saved successfully!",
      });
      setTestNote('');
      loadNotes();
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: `Failed to save note: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('test_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      console.error('Error loading notes:', error);
      toast({
        title: "Error",
        description: `Failed to load notes: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Supabase Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Authentication Status:</h3>
            {user ? (
              <div className="text-green-600">
                ✅ Logged in as: {user.email} ({user.name})
              </div>
            ) : (
              <div className="text-red-600">❌ Not logged in</div>
            )}
          </div>

          {/* Auth Controls */}
          {!user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={handleLogin} disabled={loading}>
                  Login
                </Button>
                <Button onClick={handleSignup} variant="outline" disabled={loading}>
                  Sign Up
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          )}

          {/* Data Test */}
          {user && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">💾 Data Storage Test:</h3>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter a test note..."
                  value={testNote}
                  onChange={(e) => setTestNote(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveNote} disabled={loading || !testNote.trim()}>
                  Save Note
                </Button>
              </div>

              {/* Display Notes */}
              {notes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Your Notes:</h4>
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      {note.content}
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(note.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;
