import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyDocs() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'accepted' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  
  // Accordion Expand/Collapse state for user cards
  const [expandedCards, setExpandedCards] = useState({});

  // Document Preview Modal state
  const [previewDoc, setPreviewDoc] = useState(null); // { title: '', previewUrl: '', directUrl: '', isPdf: false }

  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated');
    if (!isAuth) {
      navigate('/admin');
      return;
    }
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/requests');
      const data = response.data.requests || [];
      setRequests(data);
      
      const initialRemarks = {};
      data.forEach(req => {
        initialRemarks[req._id] = req.adminRemark || '';
      });
      setRemarks(initialRemarks);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handleVerification = async (detailId, newStatus) => {
    const remarkText = remarks[detailId] || '';
    
    if (newStatus === 'rejected' && !remarkText.trim()) {
      alert('Please provide a remark explaining the rejection reason.');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [detailId]: true }));
      await axios.put(`/admin/verify/${detailId}`, {
        status: newStatus,
        remark: remarkText
      });

      setRequests(prev => prev.map(req =>
        req._id === detailId ? { ...req, status: newStatus, adminRemark: remarkText } : req
      ));

      alert(`Applicant marked as ${newStatus.toUpperCase()}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [detailId]: false }));
    }
  };

  // Route document requests through Express backend port 5000 (/view-document)
  const getDocUrls = (url, docKey) => {
    if (!url) return { previewUrl: '', directUrl: '' };
    const isPdf = docKey !== 'ratingsImage';
    
    if (isPdf) {
      const encoded = encodeURIComponent(url);
      return {
        previewUrl: `http://localhost:5000/view-document?url=${encoded}`,
        directUrl: url
      };
    }
    
    return { previewUrl: url, directUrl: url };
  };

  const docLabels = {
    dueCertificates: '📄 Due Certificate (PDF)',
    ratingsImage: '🖼️ Ratings Proof (JPG)',
    joiningCertificate: '📜 Joining Certificate (PDF)',
    weeklyWorkHoursPdf: '⏱️ Work Hours PDF (PDF)',
    bankStatement: '🏦 Bank Statement (PDF)'
  };

  // Filter requests by active tab & Aadhar / Name / Email search query
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesTab = (req.status || 'pending') === activeTab;
      
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;

      const aadharStr = (req.user?.aadhar || '').toString().toLowerCase();
      const nameStr = (req.user?.name || '').toLowerCase();
      const emailStr = (req.user?.email || '').toLowerCase();
      const phoneStr = (req.user?.phone || '').toLowerCase();

      const matchesSearch = aadharStr.includes(q) || nameStr.includes(q) || emailStr.includes(q) || phoneStr.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      pending: requests.filter(r => (r.status || 'pending') === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
    };
  }, [requests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] text-white px-4 md:px-8 py-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Admin Verification <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f8cfb] to-[#a770ef]">Dashboard</span>
            </h1>
            <p className="text-[#b8cfff] text-sm md:text-base mt-1">Review user submissions, proof documents, and manage applicant approvals</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('adminAuthenticated');
              navigate('/admin');
            }}
            className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl font-semibold transition"
          >
            🚪 Admin Logout
          </button>
        </div>

        {/* Search Bar & Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-lg">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'pending', label: '⏳ Pending Requests', count: counts.pending, color: 'from-amber-500 to-yellow-600' },
              { id: 'accepted', label: '✅ Accepted Applicants', count: counts.accepted, color: 'from-emerald-500 to-green-600' },
              { id: 'rejected', label: '❌ Rejected Applicants', count: counts.rejected, color: 'from-red-500 to-rose-600' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-[1.02]`
                      : 'bg-white/5 hover:bg-white/15 text-[#b8cfff]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-[#b8cfff]'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Aadhar, Name, Email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* List of Applications */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#4f8cfb]/20 border-t-[#a770ef] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#b8cfff] text-lg">Loading verification requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/10">
            <p className="text-xl text-[#b8cfff]">
              {searchQuery ? `No requests found matching "${searchQuery}" in ${activeTab} tab.` : `No ${activeTab} applications found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const isAccepted = request.status === 'accepted';
              const isRejected = request.status === 'rejected';
              const isExpanded = !!expandedCards[request._id];

              return (
                <div
                  key={request._id}
                  className={`bg-white/10 backdrop-blur-xl rounded-3xl border transition-all duration-300 shadow-xl overflow-hidden ${
                    isAccepted
                      ? 'border-emerald-500/40 shadow-[0_0_30px_#22c55e22]'
                      : isRejected
                      ? 'border-red-500/40 shadow-[0_0_30px_#ef444422]'
                      : 'border-[#4f8cfb]/30 shadow-[0_0_30px_#4f8cfb22]'
                  }`}
                >
                  
                  {/* Collapsed Header Bar (Name, Aadhar & Toggle Button) */}
                  <div
                    onClick={() => toggleExpand(request._id)}
                    className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] flex items-center justify-center font-bold text-xl text-white shadow-md flex-shrink-0">
                        {request.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{request.user.name}</h3>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isAccepted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            isRejected ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#b8cfff] mt-0.5">Platform: <span className="text-white font-medium">{request.user.platform}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      {/* Aadhar Badge */}
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase">🪪 Aadhar:</span>
                        <span className="text-sm font-mono font-bold text-[#4f8cfb]">{request.user.aadhar || 'N/A'}</span>
                      </div>

                      {/* Expand / Collapse Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(request._id);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          isExpanded
                            ? 'bg-[#4f8cfb] text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-[#b8cfff]'
                        }`}
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Full Details'}</span>
                        <span className="transform transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          👇
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <div className="p-6 md:p-8 border-t border-white/10 bg-black/20 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: Full Applicant Profile */}
                        <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            👤 Applicant Profile
                          </h4>

                          <div className="space-y-2 text-sm text-[#b8cfff]">
                            <p><span className="text-white font-semibold">📧 Email:</span> {request.user.email}</p>
                            <p><span className="text-white font-semibold">🏢 Platform:</span> {request.user.platform}</p>
                            <p><span className="text-white font-semibold">📞 Phone:</span> {request.user.phone}</p>
                            <p><span className="text-white font-semibold">💰 Monthly Income:</span> ₹{request.monthlyIncome?.toLocaleString()}</p>
                            <p><span className="text-white font-semibold">⏱️ Work Hours:</span> {request.hours} hrs/week</p>
                            <p><span className="text-white font-semibold">⭐ Rating:</span> {request.rating} / 5</p>
                            <p><span className="text-white font-semibold">📅 Experience / Duration:</span> {request.duration} {request.duration === 1 ? 'year' : 'years'}</p>
                          </div>

                          {/* Dues List Section */}
                          <div className="pt-3 border-t border-white/10 space-y-2">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              💳 Existing Dues ({request.dues ? request.dues.length : 0})
                            </h5>
                            {request.dues && request.dues.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {request.dues.map((due, idx) => (
                                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                                    <div className="flex justify-between font-bold text-white">
                                      <span>{due.title || due.organization || `Due #${idx + 1}`}</span>
                                      <span className="text-rose-400">₹{Number(due.amount || 0).toLocaleString()}</span>
                                    </div>
                                    {due.organization && <p className="text-gray-400">Org: {due.organization}</p>}
                                    {due.dueDate && <p className="text-gray-400">Due Date: {new Date(due.dueDate).toLocaleDateString()}</p>}
                                    {due.isLate && (
                                      <span className="inline-block px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold text-[10px]">
                                        ⚠️ Late Payment ({due.daysLate || 0} days)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No active financial dues reported.</p>
                            )}
                          </div>
                        </div>

                        {/* Middle Column: Submitted Proof Documents */}
                        <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            📁 Submitted Proofs
                          </h4>
                          
                          <div className="space-y-2.5">
                            {request.documents && Object.keys(request.documents).length > 0 ? (
                              Object.entries(request.documents).map(([key, rawUrl]) => {
                                if (!rawUrl) return null;
                                const { previewUrl, directUrl } = getDocUrls(rawUrl, key);
                                const label = docLabels[key] || key;
                                const isPdfDoc = key !== 'ratingsImage';

                                return (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#4f8cfb]/60 transition"
                                  >
                                    <span className="text-sm text-white font-medium">{label}</span>
                                    
                                    <div className="flex items-center gap-2">
                                      {/* Inline Preview Button */}
                                      <button
                                        onClick={() => setPreviewDoc({ title: label, previewUrl, directUrl, isPdf: isPdfDoc })}
                                        className="px-3 py-1 bg-[#4f8cfb]/30 hover:bg-[#4f8cfb] rounded-lg text-xs font-bold text-[#b8cfff] hover:text-white transition"
                                      >
                                        Preview 👁️
                                      </button>

                                      {/* Direct Open in New Tab Button */}
                                      <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition"
                                        title="Open full document in new tab"
                                      >
                                        Open {isPdfDoc ? 'PDF ↗' : '↗'}
                                      </a>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-sm text-gray-400">No documents uploaded.</p>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Admin Actions & Remark */}
                        <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                              ✏️ Admin Remark
                            </h4>
                            <textarea
                              rows={4}
                              value={remarks[request._id] || ''}
                              onChange={(e) => handleRemarkChange(request._id, e.target.value)}
                              placeholder="Write feedback/remark for the applicant (required for rejection)..."
                              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] text-sm"
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            {activeTab !== 'accepted' && (
                              <button
                                onClick={() => handleVerification(request._id, 'accepted')}
                                disabled={actionLoading[request._id]}
                                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 text-sm"
                              >
                                {actionLoading[request._id] ? 'Updating...' : '✅ Accept'}
                              </button>
                            )}

                            {activeTab !== 'rejected' && (
                              <button
                                onClick={() => handleVerification(request._id, 'rejected')}
                                disabled={actionLoading[request._id]}
                                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 text-sm"
                              >
                                {actionLoading[request._id] ? 'Updating...' : '❌ Reject'}
                              </button>
                            )}

                            {activeTab !== 'pending' && (
                              <button
                                onClick={() => handleVerification(request._id, 'pending')}
                                disabled={actionLoading[request._id]}
                                className="px-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 font-bold rounded-xl transition text-xs"
                              >
                                Move to Pending
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Inline Document Preview Modal (Image & PDF) */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1e2738] border border-white/20 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{previewDoc.title}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {previewDoc.isPdf && previewDoc.directUrl && (
                    <a
                      href={previewDoc.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs transition shadow"
                    >
                      Cloudinary Link 🔗
                    </a>
                  )}
                  <a
                    href={previewDoc.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#4f8cfb] hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition shadow"
                  >
                    Open Full PDF ↗
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white font-bold flex items-center justify-center transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Viewer */}
              <div className="flex-1 p-4 overflow-auto flex items-center justify-center min-h-[550px] bg-black/40">
                {previewDoc.isPdf ? (
                  <iframe
                    src={previewDoc.previewUrl}
                    title={previewDoc.title}
                    className="w-full h-[75vh] rounded-xl border border-white/20 bg-white"
                  />
                ) : (
                  <img
                    src={previewDoc.previewUrl}
                    alt={previewDoc.title}
                    className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
                  />
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
