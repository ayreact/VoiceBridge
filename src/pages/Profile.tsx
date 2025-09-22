import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, Globe, Smartphone, Save, Edit } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  username: string;
  email: string;
  // Flat structure: profile fields are directly on ProfileData
  device_type: 'smartphone' | 'feature-phone';
  language: 'en' | 'yo' | 'ha' | 'ig';
  phone_number?: string; // Changed from 'phone' in Django to 'phone_number' here for consistency
}

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserProfile();
      
      if (response.data) {
        // Adjust the incoming data to match the frontend interface if necessary
        // Assuming API returns phone as 'phone' and not 'phone_number'
        const transformedData: ProfileData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          device_type: response.data.device_type,
          language: response.data.language,
          phone_number: response.data.phone, //
        };
        setProfileData(transformedData);
      } else {
        throw new Error(response.error || 'Failed to load profile');
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      toast({
        title: "Failed to load profile",
        description: error.message || "Could not load your profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;

    try {
      setIsSaving(true);
      
      // Transform data back to match backend expectations for update
      const dataToSend = {
        // Assuming backend expects username and email at top level or within user object
        // And phone as 'phone', not 'phone_number'
        username: profileData.username,
        email: profileData.email,
        device_type: profileData.device_type,
        language: profileData.language,
        phone: profileData.phone_number, // Map 'phone_number' back to 'phone'
      };

      const response = await api.updateUserProfile(dataToSend); // Send transformed data
      
      if (response.data) {
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been saved successfully",
        });
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Failed to update profile",
        description: error.message || "Could not save your profile changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfileField = (field: keyof ProfileData, value: any) => { // Updated type for 'field'
    if (!profileData) return;
    
    // With a flat structure, no need for 'profile.' prefix
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    return deviceType === 'smartphone' ? <Smartphone className="h-4 w-4" /> : <Phone className="h-4 w-4" />;
  };

  const getLanguageName = (langCode: string) => {
    const languages: Record<string, string> = {
      en: 'English',
      yo: 'Yoruba (Yorùbá)',
      ha: 'Hausa',
      ig: 'Igbo',
    };
    return languages[langCode] || langCode;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
          <p className="text-muted-foreground">Could not load your profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-merriweather font-bold text-gradient mb-4">
          Your Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <Button
                variant={isEditing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => updateProfileField('username', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => updateProfileField('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Device Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={profileData.language} // Direct access
                  onValueChange={(value) => updateProfileField('language', value)} // Direct update
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="yo">Yoruba (Yorùbá)</SelectItem>
                    <SelectItem value="ha">Hausa</SelectItem>
                    <SelectItem value="ig">Igbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="device_type">Device Type</Label>
                <Select
                  value={profileData.device_type} // Direct access
                  onValueChange={(value) => updateProfileField('device_type', value)} // Direct update
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartphone">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Smartphone
                      </div>
                    </SelectItem>
                    <SelectItem value="feature-phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Feature Phone
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="phone_number">Phone Number (Optional)</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={profileData.phone_number || ''} // Direct access
                onChange={(e) => updateProfileField('phone_number', e.target.value)} // Direct update
                disabled={!isEditing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for SMS notifications and IVR access
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-medium">Language</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getLanguageName(profileData.language)} {/* Direct access */}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getDeviceIcon(profileData.device_type)} {/* Direct access */}
                  <span className="font-medium">Device</span>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {profileData.device_type.replace('-', ' ')} {/* Direct access */}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};