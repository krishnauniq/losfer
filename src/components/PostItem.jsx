import { useState, useRef, useEffect } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import Card from "./ui/Card";
import Input from "./ui/Input";
import CustomSelect from "./ui/CustomSelect";
import DatePicker from "./ui/DatePicker";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

import Modal from "./ui/Modal";

// AI Moderation
import * as nsfwjs from 'nsfwjs';

import { containsProfanity } from "../utils/profanityFilter";

const CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "keys", name: "Keys" },
  { id: "pets", name: "Pets" },
  { id: "books", name: "Books" },
  { id: "others", name: "Others" }
];

export default function PostItem({ onSuccess }) {
  const fileInputRef = useRef(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Main Library");
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [category, setCategory] = useState("Electronics");
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // UI Feedback State
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });

  // AI State
  const [model, setModel] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // 'safe', 'unsafe', 'needs_review'

  useEffect(() => {
    // Load NSFW Model on Mount
    const loadModel = async () => {
      try {
        const _model = await nsfwjs.load();
        setModel(_model);
        console.log("AI Model Loaded");
      } catch (err) {
        console.error("Failed to load AI model", err);
      }
    };
    loadModel();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImagePreview(url);
      setScanResult(null);

      // AI Scan
      if (model) {
        setIsScanning(true);
        try {
          // Image Content Scan (NSFW)
          const img = document.createElement('img');
          img.src = url;
          img.width = 224;
          img.height = 224;

          // Wait for image to load before scanning
          img.onload = async () => {
            const predictions = await model.classify(img);
            console.log("AI Predictions:", predictions);

            // --- NSFW Logic ---
            const porn = predictions.find(p => p.className === 'Porn')?.probability || 0;
            const hentai = predictions.find(p => p.className === 'Hentai')?.probability || 0;
            const sexy = predictions.find(p => p.className === 'Sexy')?.probability || 0;
            const maxUnsafe = Math.max(porn, hentai, sexy);

            if (maxUnsafe > 0.85) {
              setScanResult('unsafe');
              setErrorModal({ show: true, message: "Image blocked: Content detected as inappropriate/unsafe." });
              setImage(null);
              setImagePreview(null);
            } else if (maxUnsafe > 0.50) {
              setScanResult('needs_review');
            } else {
              setScanResult('safe');
            }

            setIsScanning(false);
          };
        } catch (err) {
          console.error("Scan error", err);
          setIsScanning(false);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Text Moderation (Hinglish/English)
    const badWordTitle = containsProfanity(itemName);
    const badWordDesc = containsProfanity(description);

    if (badWordTitle || badWordDesc) {
      setErrorModal({
        show: true,
        message: `Your post contains inappropriate language used in "${badWordTitle ? 'Title' : 'Description'}" ("${badWordTitle || badWordDesc}"). Please be respectful!`
      });
      return;
    }

    // 2. Image Validation
    if (!image) {
      setErrorModal({ show: true, message: "Please upload a photo proof of the item." });
      return;
    }
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const url = await uploadToCloudinary(image);
        if (url) imageUrl = url;
      }

      await addDoc(collection(db, "items"), {
        itemName,
        description,
        categoryId: CATEGORIES.find(c => c.name === category)?.id || "other",
        location,
        category,
        dateFound,
        imageUrl,
        securityQuestion: securityQuestion || null, // Save if exists
        createdAt: serverTimestamp(),
        status: "found",
        uid: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName,
        isVerified: true
      });

      // --- Search Alert Logic ---
      try {
        const q = query(collection(db, "alerts"), where("category", "in", [category, "All"]));
        const snapshot = await getDocs(q);
        const searchName = itemName.toLowerCase();

        snapshot.forEach(async (docSnap) => {
          const alertData = docSnap.data();
          // Check if keyword matches
          if (searchName.includes(alertData.keywords.toLowerCase()) && alertData.userId !== auth.currentUser.uid) {
            // Create Notification
            await addDoc(collection(db, "notifications"), {
              recipientId: alertData.userId,
              type: "alert_match",
              title: "Found Item Alert! 🔔",
              message: `Someone just posted a "${itemName}" matching your alert for "${alertData.keywords}".`,
              relatedItemId: null, // Could link to item ID if we captured it
              createdAt: serverTimestamp(),
              read: false
            });
          }
        });
      } catch (e) {
        console.error("Error processing alerts:", e);
        // Don't block success flow
      }

      if (typeof onSuccess === 'function') onSuccess();
    } catch (error) {
      console.error("Error posting item: ", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Glass Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <Card className="!p-0 overflow-hidden rounded-[2.5rem] shadow-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 relative">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5">
            {/* Image Preview Block */}
            <div className="lg:col-span-2 bg-surface-50 dark:bg-surface-800/50 p-8 border-r border-surface-200/50 dark:border-surface-700/50 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[50px]"></div>

              <p className="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                Photo Proof
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[4/5] w-full bg-white dark:bg-surface-900 rounded-[2rem] border-2 border-dashed border-surface-300 dark:border-surface-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300 group/upload shadow-inner"
              >
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Upload preview" className={`absolute inset-0 w-full h-full object-cover rounded-[2rem] ${isScanning ? 'blur-sm grayscale' : ''}`} />

                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-2"></div>
                        <span className="text-white font-bold text-sm tracking-widest uppercase">Scanning...</span>
                      </div>
                    )}

                    {scanResult === 'needs_review' && !isScanning && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-lg">
                        ⚠️ Sensitive?
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-[2rem] backdrop-blur-sm">
                      <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span className="font-bold text-white tracking-widest uppercase text-sm">Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 transform group-hover/upload:scale-105 transition-transform">
                    <div className="w-20 h-20 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <svg h="32" w="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                    </div>
                    <h4 className="font-black text-xl text-surface-900 dark:text-white mb-2">Upload Photo</h4>
                    <p className="text-surface-500 text-xs font-medium">Click to browse or drag file here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section (3/5 width) */}
            <div className="lg:col-span-3 p-8 lg:p-12 space-y-8 bg-white/40 dark:bg-surface-900/40">
              <p className="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Item Details
              </p>

              <h2 className="text-2xl font-black text-surface-900 dark:text-white mb-6">Report Found Item</h2>

              <div className="space-y-6">
                <Input
                  label="What did you find?"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Blue Nike Backpack"
                  required
                  className="text-lg font-bold"
                />

                <div className="grid grid-cols-2 gap-6">
                  <CustomSelect
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: "Electronics", label: "Electronics" },
                      { value: "Clothing", label: "Clothing" },
                      { value: "Books", label: "Books" },
                      { value: "Keys", label: "Keys" },
                      { value: "Pets", label: "Pets" },
                      { value: "Others", label: "Others" }
                    ]}
                  />
                  <DatePicker
                    label="Date Found"
                    value={dateFound}
                    onChange={(e) => setDateFound(e.target.value)}
                    max={new Date().toISOString().split('T')[0]} // Block future dates
                    required
                    className="z-50" // Ensure calendar pops over other elements
                    align="right"
                  />
                </div>

                {/* Smart Location Selector */}
                {!showCustomLocation ? (
                  <CustomSelect
                    label="Found Location"
                    value={location}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setShowCustomLocation(true);
                        setLocation("");
                      } else {
                        setLocation(e.target.value);
                      }
                    }}
                    options={[
                      { value: "Main Library", label: "Main Library" },
                      { value: "Cafeteria", label: "Cafeteria" },
                      { value: "Gymnasium", label: "Gymnasium" },
                      { value: "A Block", label: "A Block" },
                      { value: "B Block", label: "B Block" },
                      { value: "C Block", label: "C Block" },
                      { value: "D Block", label: "D Block" },
                      { value: "E Block", label: "E Block" },
                      { value: "GBS Block", label: "GBS Block" },
                      { value: "Dormitory", label: "Dormitory" },
                      { value: "Playground", label: "Playground" },
                      { value: "Other", label: "Other / Custom" }
                    ]}
                  />
                ) : (
                  <div className="relative">
                    <Input
                      label="Custom Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Near the fountain..."
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomLocation(false)}
                      className="absolute right-3 top-[38px] text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-lg"
                    >
                      Show List
                    </button>
                  </div>
                )}

                <Textarea
                  label="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any distinguishing marks, scratches, or contents..."
                  rows={3}
                />

                {/* Security Question Section */}
                <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-2xl border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-surface-700 dark:text-surface-300 flex items-center gap-2">
                      🔐 Security Question
                      <span className="text-xs font-normal text-surface-500 bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full">Optional</span>
                    </label>
                  </div>

                  <p className="text-xs text-surface-500 mb-3">
                    Set a question that only the real owner would know.
                    <br />
                    <span className="italic opacity-80">(e.g., "What is the phone's wallpaper?", "What is the keychain color?")</span>
                  </p>

                  <Input
                    placeholder="e.g. What is the wallpaper image?"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="mb-2"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-surface-200/50 dark:border-surface-700/50">
                <Button
                  type="submit"
                  isLoading={loading || isScanning}
                  disabled={loading || isScanning || scanResult === 'unsafe'}
                  className="w-full h-16 text-xl font-black tracking-wide bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-2xl shadow-xl shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? 'ANALYZING IMAGE...' : 'PUBLISH REPORT ➜'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Error/Warning Modal */}
      <Modal
        isOpen={errorModal.show}
        onClose={() => setErrorModal({ ...errorModal, show: false })}
        title=""
        maxWidth="max-w-sm"
      >
        <div className="text-center relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full -z-10"></div>

          <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
              <span className="text-3xl text-white">🛡️</span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-surface-900 dark:text-white mb-2">Upload Reserved</h3>

          <p className="text-base font-medium text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
            {errorModal.message}
          </p>

          <Button
            onClick={() => setErrorModal({ ...errorModal, show: false })}
            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 border-none py-3"
          >
            Understood
          </Button>
        </div>
      </Modal>
    </div>
  );
}
