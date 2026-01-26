import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, limit, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import ItemModal from "./ItemModal";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Skeleton from "./ui/Skeleton";
import ClaimModal from "./modals/ClaimModal";
import ReturnQRModal from "./modals/ReturnQRModal";
import ScanQRModal from "./modals/ScanQRModal";
import ChatInterface from "./chat/ChatInterface";
import FloatingActions from "./ui/FloatingActions";
import CelebrationModal from "./modals/CelebrationModal";
import ReportModal from "./modals/ReportModal";
import ReviewClaimModal from "./modals/ReviewClaimModal";

export default function ItemList({ maxLimit, hideFilters }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam !== null) {
      setSearchTerm(qParam);
    }
  }, [searchParams]);

  // Modal State - Use ID to track selected item to avoid stale data
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimItem, setClaimItem] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [returnedItemName, setReturnedItemName] = useState("");
  const [chatItem, setChatItem] = useState(null);

  // Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [itemToReport, setItemToReport] = useState(null);

  // Review Claim State (Finder Side)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [itemToReview, setItemToReview] = useState(null);

  // Helper: Relative Time
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(timestamp.seconds * 1000)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  };

  // Derive selected item from items list to get latest status
  const selectedItem = items.find(i => i.id === selectedItemId);

  useEffect(() => {
    let q;
    if (maxLimit) {
      q = query(collection(db, "items"), orderBy("createdAt", "desc"), limit(maxLimit));
    } else {
      q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [maxLimit]);

  const initiateClaim = (item, e) => {
    if (e) e.stopPropagation();
    setClaimItem(item);
    setShowClaimModal(true);
  };

  const handleClaim = async (itemId, claimData) => {
    try {
      const item = items.find(i => i.id === itemId);
      const itemRef = doc(db, "items", itemId);
      const currentUser = auth.currentUser;

      // LOGIC: If Security Question exists, set to 'pending_approval'. Else 'claimed'.
      const hasSecurityCheck = !!item.securityQuestion;
      const newStatus = hasSecurityCheck ? "pending_approval" : "claimed";
      const notificationType = hasSecurityCheck ? "claim_request" : "claim_alert";
      const notificationTitle = hasSecurityCheck ? "New Claim Request" : "Item Claimed";

      // Update item with claim details
      await updateDoc(itemRef, {
        status: newStatus,
        claimantId: currentUser.uid,
        claimantName: currentUser.displayName || "Anonymous",
        claimProof: claimData, // has description, marks
        claimantAnswer: claimData.securityAnswer || null, // Store the answer!
        claimedAt: new Date().toISOString()
      });

      // Create notification for the finder
      if (item && item.uid) {
        await addDoc(collection(db, "notifications"), {
          recipientId: item.uid,
          type: notificationType,
          title: notificationTitle,
          message: hasSecurityCheck
            ? `${currentUser.displayName || "Someone"} answered your security question. Review it now.`
            : `${currentUser.displayName || "Someone"} has claimed your "${item.itemName}".`,
          relatedItemId: itemId,
          createdAt: serverTimestamp(),
          read: false
        });
      }

    } catch (error) {
      console.error("Error claiming item:", error);
      alert("Failed to claim item.");
    }
  };

  const handleApproveClaim = async (item) => {
    try {
      await updateDoc(doc(db, "items", item.id), { status: "claimed" });

      // Notify Claimant
      await addDoc(collection(db, "notifications"), {
        recipientId: item.claimantId,
        type: "claim_approved",
        title: "Claim Approved! 🎉",
        message: `The finder approved your answer for "${item.itemName}". You can now chat!`,
        relatedItemId: item.id,
        createdAt: serverTimestamp(),
        read: false
      });

      setShowReviewModal(false);
    } catch (e) {
      console.error(e);
      alert("Error approving claim");
    }
  };

  const handleRejectClaim = async (item) => {
    try {
      await updateDoc(doc(db, "items", item.id), {
        status: "found",
        claimantId: null,
        claimantName: null,
        claimProof: null,
        claimantAnswer: null
      });
      setShowReviewModal(false);
      alert("Claim rejected. Item is back to 'Found' status.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAlert = async () => {
    if (!auth.currentUser) {
      alert("Please login to create alerts.");
      return;
    }
    if (!searchTerm) return;

    try {
      await addDoc(collection(db, "alerts"), {
        userId: auth.currentUser.uid,
        keywords: searchTerm.toLowerCase(),
        category: categoryFilter,
        createdAt: serverTimestamp()
      });
      setShowAlertSuccess(true);
    } catch (e) {
      console.error("Error creating alert:", e);
    }
  };

  const handleVerifyClaim = async (itemId) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { status: "verified" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleQRVerification = async (itemId) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, {
        status: "returned",
        returnedAt: new Date().toISOString()
      });

      const item = items.find(i => i.id === itemId);
      setReturnedItemName(item ? item.itemName : "Item");

      // Set these first to clean up the UI
      setShowScanModal(false);
      setSelectedItemId(null);

      // Small delay before showing celebration to prevent DOM race conditions (White Screen)
      setTimeout(() => {
        setShowCelebrationModal(true);
      }, 500);

    } catch (e) {
      console.error("Verification failed", e);
      alert("Verification failed: " + e.message);
    }
  };

  const handleDelete = (itemId, e) => {
    if (e) e.stopPropagation();
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, "items", itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const initiateReport = (item, e) => {
    if (e) e.stopPropagation();
    setItemToReport(item);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reason) => {
    if (!itemToReport) return;
    try {
      const itemRef = doc(db, "items", itemToReport.id);
      const reportRef = collection(db, "reports");
      const currentUid = auth.currentUser?.uid || "anonymous";

      // 1. Check if already reported by this user
      // We can check local state if we trust it, or re-fetch. Ideally re-fetch or rely on `itemToReport`.
      // Let's check the passed `itemToReport` object first, assuming it's relatively fresh from real-time listener.
      const alreadyReported = itemToReport.reportedBy?.includes(currentUid);

      if (alreadyReported) {
        alert("You have already reported this item.");
        setShowReportModal(false);
        return;
      }

      // 2. Create Report Document (Audit Log)
      await addDoc(reportRef, {
        itemId: itemToReport.id,
        itemName: itemToReport.itemName,
        reporterId: currentUid,
        reason: reason,
        timestamp: serverTimestamp()
      });

      // 3. Update Item: Add Reporter to Array & Check Height Logic
      // We optimistically calculate new length for UI/Check
      const currentReporters = itemToReport.reportedBy || [];
      const newLength = currentReporters.length + 1;
      const shouldHide = newLength >= 2;

      await updateDoc(itemRef, {
        reportedBy: arrayUnion(currentUid),
        hidden: shouldHide
      });

      setShowReportModal(false);
      setShowReportSuccess(true);

    } catch (error) {
      console.error("Error reporting:", error);
      alert("Failed to submit report.");
    }
  };

  // Filter Logic
  const filteredItems = items.filter((item) => {
    // 7-day expiration logic
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const itemDate = item.createdAt ? new Date(item.createdAt.seconds * 1000) : new Date();
    const matchesDate = itemDate > sevenDaysAgo;

    // Filter Logic
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;

    // Updated Status Filter Logic
    const matchesStatus = statusFilter === "All" ||
      (statusFilter === "Found" && item.status !== "claimed" && item.status !== "verified" && item.status !== "returned") ||
      (statusFilter === "Claimed" && (item.status === "claimed" || item.status === "verified")) ||
      (statusFilter === "Returned" && item.status === "returned");

    // Hide if explicitly hidden (moderation)
    const isHidden = item.hidden === true;

    return matchesSearch && matchesCategory && matchesStatus && matchesDate && !isHidden;
  });

  if (loading) return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} noPadding className="overflow-hidden bg-white dark:bg-surface-50 border border-surface-400 dark:border-surface-700">
          <Skeleton className="h-48 w-full" variant="rectangular" />
          <div className="p-5 space-y-3">
            <Skeleton variant="title" />
            <Skeleton variant="text" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="w-20" variant="text" />
              <Skeleton className="w-16" variant="text" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {!hideFilters && (
        <Card className="border-none shadow-none bg-transparent !p-0 space-y-4">
          {/* 1. Search Bar at Top */}
          <div className="w-full">
            <Input
              placeholder="Search items by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-lg shadow-sm border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm focus:ring-primary-500 focus:border-primary-500 rounded-2xl"
            />
          </div>

          {/* 2. Status Filter Tabs Below */}
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2 bg-surface-100/50 dark:bg-surface-800/50 backdrop-blur-md p-1.5 rounded-2xl border border-surface-200 dark:border-surface-700 mx-auto md:mx-0">
              {["All", "Found", "Claimed", "Returned"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                        relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap
                        ${statusFilter === status
                      ? "text-white shadow-lg shadow-primary-500/25 scale-105"
                      : "text-surface-500 hover:text-surface-900 dark:hover:text-surface-300 hover:bg-white/50 dark:hover:bg-surface-700/50"
                    }
                      `}
                >
                  {statusFilter === status && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-xl -z-10 animate-fade-in" />
                  )}
                  {status}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            onClick={() => setSelectedItemId(item.id)}
            className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            noPadding
          >
            <div className="h-56 overflow-hidden relative bg-surface-100 dark:bg-surface-800">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-surface-400 p-6 text-center">
                  <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-xs font-medium">No image uploaded</span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="neutral" className="shadow-lg font-bold bg-white/90 backdrop-blur text-surface-900 border-none">
                  {item.category}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                {item.status === 'returned' ? (
                  <Badge variant="neutral" className="bg-gray-100/90 backdrop-blur text-gray-600 border border-gray-200 font-bold shadow-sm">Returned</Badge>
                ) : item.status === 'verified' ? (
                  <Badge variant="success" className="bg-emerald-100/90 text-emerald-700 shadow-sm border border-emerald-200 font-bold">Verified</Badge>
                ) : item.status === 'claimed' ? (
                  <Badge variant="info" className="bg-blue-100/90 text-blue-700 shadow-sm border border-blue-200 font-bold">Claimed</Badge>
                ) : (
                  <Badge variant="success" className="bg-lime-400/90 backdrop-blur text-lime-900 border border-lime-500/20 font-black shadow-lg">FOUND</Badge>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-surface-900 line-clamp-1 flex items-center">
                  {item.itemName}
                  {item.isVerified && (
                    <span className="ml-2 text-success-500" title="Verified Finder">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    </span>
                  )}
                </h3>
              </div>

              <div className="flex items-center justify-between mb-3">
                <Badge variant="info">{item.category}</Badge>
              </div>

              <p className="text-surface-500 text-sm flex items-center mb-4">
                <span className="mr-1.5 opacity-60">📍</span> {item.location}
              </p>

              <div className="border-t border-surface-100 pt-3 flex justify-between items-center">
                <span className="text-xs text-surface-500 font-medium flex items-center gap-1">
                  ⏱️ {getTimeAgo(item.createdAt)}
                </span>

                {item.status !== 'claimed' && item.status !== 'returned' && item.status !== 'verified' && item.status !== 'pending_approval' ? (
                  auth.currentUser?.uid !== item.uid ? (
                    <Button
                      size="sm"
                      onClick={(e) => initiateClaim(item, e)}
                      className="z-10"
                    >
                      Claim Item
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-surface-400 uppercase tracking-widest px-2">
                      Your Post
                    </span>
                  )
                ) : (
                  <div className="flex gap-2 items-center">
                    {/* Status Badges */}
                    {item.status === 'pending_approval' ? (
                      auth.currentUser?.uid === item.uid ? (
                        <Button
                          size="sm"
                          className="bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 animate-pulse font-bold"
                          onClick={(e) => { e.stopPropagation(); setItemToReview(item); setShowReviewModal(true); }}
                        >
                          🔔 Review Claim
                        </Button>
                      ) : (
                        <span className="text-sm font-bold flex items-center text-amber-500">
                          ⏳ Pending Approval
                        </span>
                      )
                    ) : (
                      <span className={`text-sm font-bold flex items-center ${item.status === 'returned' ? 'text-success-600' : 'text-primary-600'}`}>
                        {item.status === 'verified' ? 'Verified' : (item.status === 'returned' ? 'Returned' : 'Claimed')}
                      </span>
                    )}

                    {/* Chat Button: Only show if TRULY claimed/verified, NOT pending */}
                    {item.status !== 'returned' && item.status !== 'pending_approval' && (auth.currentUser?.uid === item.uid || auth.currentUser?.uid === item.claimantId) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); setChatItem(item); }}
                        className="text-primary-600 border-primary-200 hover:bg-primary-50"
                      >
                        💬 Chat
                      </Button>
                    )}
                  </div>
                )}

                {auth.currentUser?.uid === item.uid ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-error-500 hover:bg-error-50 hover:text-error-600 p-1"
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete Item"
                  >
                    🗑️
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-surface-400 hover:text-error-500 hover:bg-error-50 p-1"
                    onClick={(e) => initiateReport(item, e)}
                    title="Report Inappropriate"
                  >
                    🚩
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && searchTerm && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span className="text-4xl opacity-50">🔍</span>
          </div>
          <h3 className="text-2xl font-black text-surface-900 dark:text-white mb-2">No matches found</h3>
          <p className="text-surface-500 max-w-md mx-auto mb-8">
            We couldn't find "{searchTerm}" in the list.
          </p>

          <Button
            onClick={handleCreateAlert}
            className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-xl shadow-primary-500/20 px-8 py-4 rounded-xl text-lg font-bold"
          >
            🔔 Notify me if found
          </Button>
        </div>
      )}

      {
        filteredItems.length === 0 && !loading && (
          <Card className="text-center py-16 bg-surface-50 border-dashed border-2 border-surface-300">
            <p className="text-xl text-surface-500 font-medium">No items found matching criteria.</p>
            <Button
              variant="ghost"
              onClick={() => { setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All"); }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          </Card>
        )
      }

      {
        selectedItem && (
          <ItemModal
            item={selectedItem}
            onClose={() => setSelectedItemId(null)}
            onClaim={() => initiateClaim(selectedItem)}
            onReview={() => { setItemToReview(selectedItem); setShowReviewModal(true); }}
            onVerifyClaim={() => handleVerifyClaim(selectedItem.id)}
            onShowQR={() => setShowQRModal(true)}
            onScanQR={() => setShowScanModal(true)}
          />
        )
      }

      <ClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        itemName={claimItem?.itemName}
        securityQuestion={claimItem?.securityQuestion}
        onSubmit={(data) => handleClaim(claimItem.id, data)}
      />

      <ReturnQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        item={selectedItem}
      />

      <ScanQRModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onVerify={handleQRVerification}
      />

      <CelebrationModal
        isOpen={showCelebrationModal}
        itemName={returnedItemName}
        onClose={() => window.location.reload()}
      />

      {
        chatItem && (
          <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-slide-up">
            <ChatInterface
              itemId={chatItem.id}
              itemName={chatItem.itemName}
              onClose={() => setChatItem(null)}
            />
          </div>
        )
      }

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        itemName={itemToReport?.itemName}
        onSubmit={handleReportSubmit}
      />

      <ReviewClaimModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        item={itemToReview}
        onApprove={() => handleApproveClaim(itemToReview)}
        onReject={() => handleRejectClaim(itemToReview)}
      />

      {/* Success Popup for Report */}
      {
        showReportSuccess && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportSuccess(false)}></div>
            <div className="relative bg-white dark:bg-surface-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 border border-surface-100 dark:border-surface-700">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-surface-800 shadow-xl">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-black text-surface-900 dark:text-white mb-2">Report Received</h3>
              <p className="text-surface-500 dark:text-surface-300 mb-6 font-medium">
                Thanks for keeping Losfer safe! We'll review this item shortly.
              </p>
              <Button onClick={() => setShowReportSuccess(false)} className="w-full shadow-xl shadow-primary-500/20 bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                Got it
              </Button>
            </div>
          </div>
        )
      }

      {/* Success Popup for Alert */}
      {
        showAlertSuccess && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAlertSuccess(false)}></div>
            <div className="relative bg-white dark:bg-surface-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 border border-surface-100 dark:border-surface-700">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-surface-800 shadow-xl">
                <span className="text-3xl">🔔</span>
              </div>
              <h3 className="text-xl font-black text-surface-900 dark:text-white mb-2">Alert Active</h3>
              <p className="text-surface-500 dark:text-surface-300 mb-6 font-medium">
                We'll notify you as soon as "{searchTerm}" appears in the list!
              </p>
              <Button onClick={() => setShowAlertSuccess(false)} className="w-full shadow-xl shadow-primary-500/20 bg-purple-600 hover:bg-purple-700 text-white border-none">
                Awesome
              </Button>
            </div>
          </div>
        )
      }

      {/* Custom Delete Confirmation Modal */}
      {
        showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowDeleteModal(false)}
            ></div>
            <div className="relative bg-white dark:bg-surface-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-surface-200 dark:border-surface-700">
              <div className="w-16 h-16 bg-error-50 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🗑️
              </div>
              <h3 className="text-xl font-black text-center text-surface-900 dark:text-surface-100 mb-2">Delete Item?</h3>
              <p className="text-center text-surface-500 mb-8">
                Are you sure you want to remove this item? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-3 rounded-xl font-bold text-surface-600 bg-surface-100 hover:bg-surface-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-3 rounded-xl font-bold text-white bg-error-500 hover:bg-error-600 shadow-lg shadow-error-500/30 transition-all hover:-translate-y-0.5"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {!hideFilters && <FloatingActions onFocusSearch={() => document.querySelector('input[placeholder="Search items..."]')?.focus()} />}
    </div >
  );
}
