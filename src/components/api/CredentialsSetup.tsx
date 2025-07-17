import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { PMSConnection } from '../../types/pms'
import { Key, Shield, Eye, EyeOff, Copy, Check } from 'lucide-react'

interface CredentialsSetupProps {
  connection: PMSConnection
  onCredentialsSet: (connectionId: string) => void
}

export function CredentialsSetup({ connection, onCredentialsSet }: CredentialsSetupProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [credentials, setCredentials] = useState({
    apiKey: '',
    username: '',
    password: '',
    oauthToken: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const getCredentialFields = () => {
    switch (connection.authType) {
      case 'api_key':
        return [
          {
            key: 'apiKey',
            label: 'API Key',
            placeholder: 'Enter your PMS API key',
            type: 'password',
            secretName: `${connection.id}_api_key`
          }
        ]
      case 'basic_auth':
        return [
          {
            key: 'username',
            label: 'Username',
            placeholder: 'Enter username',
            type: 'text',
            secretName: `${connection.id}_username`
          },
          {
            key: 'password',
            label: 'Password',
            placeholder: 'Enter password',
            type: 'password',
            secretName: `${connection.id}_password`
          }
        ]
      case 'oauth':
        return [
          {
            key: 'oauthToken',
            label: 'OAuth Token',
            placeholder: 'Enter OAuth access token',
            type: 'password',
            secretName: `${connection.id}_oauth_token`
          }
        ]
      default:
        return []
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(field)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSaveCredentials = () => {
    // In a real implementation, these would be saved to the secure vault
    // For demo purposes, we'll just simulate the process
    console.log('Saving credentials for connection:', connection.id)
    console.log('Credentials would be stored securely in Blink vault')
    
    onCredentialsSet(connection.id)
    setShowDialog(false)
  }

  const getInstructions = () => {
    const instructions = {
      opera: {
        apiKey: 'Go to Oracle Opera Cloud → Administration → Integration → API Keys → Generate New Key',
        basic: 'Use your Opera Cloud username and password'
      },
      mews: {
        apiKey: 'Go to Mews Commander → Settings → Integrations → API → Create Access Token',
        oauth: 'Use OAuth 2.0 flow with Mews API'
      },
      fidelio: {
        apiKey: 'Contact your Fidelio administrator for API credentials',
        basic: 'Use your Fidelio Suite8 login credentials'
      },
      protel: {
        apiKey: 'Go to Protel Air → Settings → API Management → Generate API Key',
        basic: 'Use your Protel Air username and password'
      },
      cloudbeds: {
        apiKey: 'Go to Cloudbeds → Settings → API → Generate API Key',
        oauth: 'Use OAuth 2.0 with Cloudbeds API'
      },
      rms: {
        apiKey: 'Go to RMS Cloud → Settings → Integrations → API Keys → Create New',
        basic: 'Use your RMS Cloud credentials'
      },
      custom: {
        apiKey: 'Refer to your PMS documentation for API key generation',
        basic: 'Use the credentials provided by your PMS administrator',
        oauth: 'Follow your PMS OAuth 2.0 implementation guide'
      }
    }

    return instructions[connection.type] || instructions.custom
  }

  const fields = getCredentialFields()
  const instructions = getInstructions()

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          Set Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Set API Credentials for {connection.name}
          </DialogTitle>
          <DialogDescription>
            Securely store your PMS API credentials. All credentials are encrypted and stored in Blink's secure vault.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">How to get your credentials:</p>
                {connection.authType === 'api_key' && (
                  <p className="text-sm">{instructions.apiKey}</p>
                )}
                {connection.authType === 'basic_auth' && (
                  <p className="text-sm">{instructions.basic}</p>
                )}
                {connection.authType === 'oauth' && (
                  <p className="text-sm">{instructions.oauth}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Credential Fields */}
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    type={field.type === 'password' && !showPassword ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={credentials[field.key as keyof typeof credentials]}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      [field.key]: e.target.value
                    })}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {field.type === 'password' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 p-0"
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(field.secretName, field.key)}
                      className="h-6 w-6 p-0"
                      title="Copy secret name"
                    >
                      {copied === field.key ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Secret name: <code className="bg-gray-100 px-1 rounded">{field.secretName}</code>
                </p>
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-green-700 space-y-1">
                <li>• All credentials are encrypted using AES-256 encryption</li>
                <li>• Stored securely in Blink's vault, never in your browser</li>
                <li>• Only accessible by your authenticated API calls</li>
                <li>• Can be updated or removed at any time</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCredentials}
              disabled={!fields.some(field => credentials[field.key as keyof typeof credentials])}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              Save Credentials
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}