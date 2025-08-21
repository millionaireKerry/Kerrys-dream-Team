import React, { useState } from 'react';

interface KnowledgeUploadProps {
  agents: Array<{ id: string; name: string; role: string }>;
  onUploadComplete: () => void;
}

export const KnowledgeUpload: React.FC<KnowledgeUploadProps> = ({ agents, onUploadComplete }) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !title || !content) return;

    setIsUploading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/embed-documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents: [{
            title,
            content,
            agentId: selectedAgent,
            filename: `${title}.txt`
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload knowledge');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedAgent('');
      
      onUploadComplete();
      alert('Knowledge uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload knowledge. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="panel-title">Upload Knowledge Base</div>
      <div className="panel-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
              required
            >
              <option value="">Select Agent</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.role}
                </option>
              ))}
            </select>
          </div>
          
          <div className="row">
            <input 
              type="text" 
              placeholder="Document title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <textarea 
            placeholder="Paste the content from your PDF here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ minHeight: '300px' }}
            required
          />
          
          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isUploading || !selectedAgent || !title || !content}
            >
              {isUploading ? 'Uploading...' : 'Upload Knowledge'}
            </button>
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={() => {
                setTitle('');
                setContent('');
                setSelectedAgent('');
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};