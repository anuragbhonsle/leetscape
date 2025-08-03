import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UsernameSetupProps {
  onComplete: () => void;
}

export const UsernameSetup: React.FC<UsernameSetupProps> = ({ onComplete }) => {
  const { userProfile, updateProfile } = useAuth();
  const [username, setUsername] = useState(userProfile?.customUsername || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateProfile({ customUsername: username.trim() });
      onComplete();
    } catch (error) {
      setError('Failed to update username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md card-elevated border-border shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary-soft rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Choose Your Username</CardTitle>
          <p className="text-muted-foreground">
            Pick a unique username for your LeetScape profile. This will be displayed to other users.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-11"
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Username must be 3-20 characters, letters, numbers, and underscores only.
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary-hover transition-smooth"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Setting up...
                </div>
              ) : (
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Complete Setup
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 