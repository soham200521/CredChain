import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyDocs() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/admin/requests');
        setRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleVerification = async (userId, status) => {
    try {
      await axios.put(`/admin/verify/${userId}`, { status });
      setRequests(requests.map(req =>
        req.userId === userId ? { ...req, status } : req
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const downloadDocument = async (url) => {
    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = url.split('/').pop();
      link.click();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center py-16 mt-3">
        <div className="bg-gradient-to-br from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] rounded-3xl p-8 md:p-10 shadow-[0_0_40px_#ff80bf55] border border-white/10 backdrop-blur-xl animate-fade-in-up">
          <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Verification Requests (Last 5 Days)
          </h1>
          {loading ? (
            <div className="text-center text-lg text-gray-300">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center text-lg text-gray-300">No requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left">User</th>
                    <th className="py-3 px-6 text-left">Documents</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-b border-white/10">
                      <td className="py-4 px-6">{request.userEmail}</td>
                      <td className="py-4 px-6">
                        {request.documents.map((doc, index) => (
                          <button
                            key={index}
                            onClick={() => downloadDocument(doc.url)}
                            className="text-pink-400 hover:underline mr-4"
                          >
                            {doc.name}
                          </button>
                        ))}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded ${
                          request.status === 'verified' ? 'bg-green-700/40 text-green-200' :
                          request.status === 'rejected' ? 'bg-red-700/40 text-red-200' : 'bg-gray-700/40 text-gray-300'
                        }`}>
                          {request.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 space-x-2">
                        <button
                          onClick={() => handleVerification(request.userId, 'verified')}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                          disabled={request.status === 'verified'}
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleVerification(request.userId, 'rejected')}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          disabled={request.status === 'rejected'}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
