import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  BookOpen, 
  CheckCircle, 
  ExternalLink, 
  Shield, 
  Zap, 
  Database,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react'

export function IntegrationGuide() {
  const supportedPMS = [
    {
      name: 'Oracle Opera',
      type: 'opera',
      popularity: 'High',
      difficulty: 'Medium',
      features: ['Reservations', 'Guests', 'Revenue', 'Rooms'],
      authTypes: ['API Key', 'Basic Auth'],
      documentation: 'https://docs.oracle.com/en/industries/hospitality/opera-cloud/'
    },
    {
      name: 'Mews Commander',
      type: 'mews',
      popularity: 'High',
      difficulty: 'Easy',
      features: ['Reservations', 'Guests', 'Revenue', 'Occupancy'],
      authTypes: ['API Key', 'OAuth 2.0'],
      documentation: 'https://mews-systems.gitbook.io/connector-api/'
    },
    {
      name: 'Fidelio Suite8',
      type: 'fidelio',
      popularity: 'Medium',
      difficulty: 'Hard',
      features: ['Reservations', 'Guests', 'Revenue'],
      authTypes: ['API Key', 'Basic Auth'],
      documentation: 'Contact Fidelio support'
    },
    {
      name: 'Protel Air',
      type: 'protel',
      popularity: 'Medium',
      difficulty: 'Medium',
      features: ['Reservations', 'Guests', 'Revenue', 'Rooms'],
      authTypes: ['API Key', 'Basic Auth'],
      documentation: 'https://developer.protel.net/'
    },
    {
      name: 'Cloudbeds',
      type: 'cloudbeds',
      popularity: 'High',
      difficulty: 'Easy',
      features: ['Reservations', 'Guests', 'Revenue', 'Occupancy'],
      authTypes: ['API Key', 'OAuth 2.0'],
      documentation: 'https://hotels.cloudbeds.com/api/'
    },
    {
      name: 'RMS Cloud',
      type: 'rms',
      popularity: 'Medium',
      difficulty: 'Medium',
      features: ['Reservations', 'Guests', 'Revenue'],
      authTypes: ['API Key', 'Basic Auth'],
      documentation: 'https://www.rmscloud.com/api-documentation'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'High': return 'bg-blue-100 text-blue-800'
      case 'Medium': return 'bg-purple-100 text-purple-800'
      case 'Low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">PMS Integration Guide</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect your Property Management System to automatically sync reservations, guest data, revenue, and analytics in real-time.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">Real-time Sync</h3>
            <p className="text-sm text-gray-600">Data updates automatically</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Secure</h3>
            <p className="text-sm text-gray-600">Encrypted credentials</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-gray-600">Advanced insights</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">Time Saving</h3>
            <p className="text-sm text-gray-600">No manual uploads</p>
          </CardContent>
        </Card>
      </div>

      {/* Setup Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Quick Setup Process
          </CardTitle>
          <CardDescription>
            Follow these simple steps to connect your PMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Add Connection</h4>
                <p className="text-gray-600">Click "Add Connection" and select your PMS type</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Configure Settings</h4>
                <p className="text-gray-600">Enter your API endpoint and choose authentication method</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Set Credentials</h4>
                <p className="text-gray-600">Securely store your API keys or login credentials</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Test & Sync</h4>
                <p className="text-gray-600">Test the connection and start syncing your data</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported PMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Supported PMS Systems
          </CardTitle>
          <CardDescription>
            We support the most popular Property Management Systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {supportedPMS.map((pms) => (
              <div key={pms.type} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{pms.name}</h3>
                    <Badge className={getPopularityColor(pms.popularity)}>
                      {pms.popularity} Usage
                    </Badge>
                    <Badge className={getDifficultyColor(pms.difficulty)}>
                      {pms.difficulty} Setup
                    </Badge>
                  </div>
                  {pms.documentation !== 'Contact Fidelio support' && (
                    <a 
                      href={pms.documentation} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Docs
                    </a>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Supported Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {pms.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Authentication:</p>
                    <div className="flex flex-wrap gap-1">
                      {pms.authTypes.map((auth) => (
                        <Badge key={auth} variant="secondary" className="text-xs">
                          {auth}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Security & Privacy</p>
            <ul className="text-sm space-y-1">
              <li>• All API credentials are encrypted using AES-256 encryption</li>
              <li>• Data is transmitted over secure HTTPS connections</li>
              <li>• We never store sensitive guest information permanently</li>
              <li>• You can revoke access and delete credentials at any time</li>
              <li>• All data syncing complies with GDPR and hospitality privacy standards</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Need Help */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-700">
            <p>Our team is here to help you get connected:</p>
            <ul className="text-sm space-y-1">
              <li>• Contact your PMS administrator for API access</li>
              <li>• Check our documentation for step-by-step guides</li>
              <li>• Reach out to support if you encounter any issues</li>
              <li>• We can help with custom integrations for enterprise clients</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}