import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production Key',
      key: 'uk_live_1234567890abcdef',
      created: '2025-06-01',
      lastUsed: '2025-06-24'
    },
    {
      id: '2', 
      name: 'Development Key',
      key: 'uk_test_0987654321fedcba',
      created: '2025-06-15',
      lastUsed: '2025-06-23'
    }
  ])
  
  const [showNewKeyForm, setShowNewKeyForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard!')
  }

  const generateNewKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key')
      return
    }

    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `uk_live_${Math.random().toString(36).substring(2, 18)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName('')
    setShowNewKeyForm(false)
    toast.success('New API key generated!')
  }

  const deleteKey = (keyId) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId))
      toast.success('API key deleted')
    }
  }

  return (
    <div className="space-y-4">
      {/* Existing Keys */}
      {apiKeys.map((apiKey) => (
        <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
            <button
              onClick={() => deleteKey(apiKey.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
          
          <div className="bg-gray-50 p-2 rounded border mb-2">
            <code className="text-sm text-gray-700 break-all">
              {apiKey.key}
            </code>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Created: {apiKey.created}</span>
            <span>Last used: {apiKey.lastUsed}</span>
          </div>
          
          <button
            onClick={() => copyToClipboard(apiKey.key)}
            className="btn-secondary text-sm"
          >
            Copy Key
          </button>
        </div>
      ))}

      {/* Add New Key */}
      {!showNewKeyForm ? (
        <button
          onClick={() => setShowNewKeyForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Generate New API Key
        </button>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Generate New API Key</h4>
          <input
            type="text"
            placeholder="Enter key name (e.g., 'Mobile App', 'Website')"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="input-field mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={generateNewKey}
              className="btn-primary"
            >
              Generate
            </button>
            <button
              onClick={() => {
                setShowNewKeyForm(false)
                setNewKeyName('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
