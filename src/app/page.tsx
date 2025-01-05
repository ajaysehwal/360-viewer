"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import {
  Upload,
  Link,
  Check,
  Copy,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase";
import GoogleAuth from "@/components/googleAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { encrypt, iv, key } from "@/utils";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

const stages = {
  GENERATING: "Preparing your panorama...",
  ENCRYPTING: "Securing your content...",
  FINALIZING: "Almost there...",
  COMPLETE: "Ready to share!",
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Home() {
  const [linkProgress, setLinkProgress] = useState(0);
  const [linkStage, setLinkStage] = useState<keyof typeof stages | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageLink, setImageLink] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(imageLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await processImage(file);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) await processImage(file);
  };

  const processImage = async (file: File) => {
    try {
      if (!auth.currentUser) {
        setError("Please sign in to generate 3D image links");
        return;
      }
      setError("");
      setLinkStage("GENERATING");
      setLinkProgress(30);
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }
      const filename = `${Date.now()}-${file.name}`;
      const storageRef = ref(
        storage,
        `3d-views/${auth.currentUser.uid}/${filename}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const encryptedUrl = encrypt(downloadURL, key, iv);
      setLinkStage("ENCRYPTING");
      setLinkProgress(50);

      setLinkProgress(80);

      setLinkStage("FINALIZING");
      setLinkProgress(90);
      setImageLink(`${process.env.NEXT_PUBLIC_HOME}/view/${encryptedUrl}`);
      setLinkProgress(100);
      setLinkStage("COMPLETE");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setLinkStage(null);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar user={user} />
      <main className="container mx-auto pt-24 px-4 pb-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-4xl lg:max-w-4xl sm:max-w-full mx-auto"
        >
          <div className="rounded-2xl backdrop-blur-sm bg-white/80 shadow-xl p-8">
            <HeroHighlight>
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: [20, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-2xl px-4 md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
              >
                360° Panorama Viewer VR
              </motion.h1>
              <Highlight className="text-black dark:text-white text-2xl">
                Transform your panoramic photos into immersive VR experiences
              </Highlight>
            </HeroHighlight>

            <div className="flex flex-col items-center gap-8">
              <div
                className="w-full max-w-2xl"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label htmlFor="image-upload">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative border-3 border-2 border-purple-300 border-dashed rounded-xl p-12
                      ${
                        isDragging
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-opacity-50"
                          : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
                      }
                      transition-all duration-200 cursor-pointer group
                    `}
                  >
                    <div className="flex flex-col items-center gap-6">
                      <motion.div
                        animate={{
                          y: isDragging ? [-10, 0] : 0,
                          scale: isDragging ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {imageSrc ? (
                          <ImageIcon className="w-16 h-16 text-purple-500" />
                        ) : (
                          <Upload className="w-16 h-16 text-purple-500" />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          {isDragging
                            ? "Drop your image here"
                            : "Drop your image or click to upload"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPEG, PNG - Max 20MB
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <AnimatePresence>
                {!auth.currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <p className="flex items-center gap-3 text-amber-700">
                      Please <GoogleAuth />
                      to generate and share 3D image links
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    {...fadeIn}
                    className="w-full max-w-2xl p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </motion.div>
                )}

                {linkStage && (
                  <motion.div
                    {...fadeIn}
                    className="w-full max-w-2xl bg-gray-50 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {linkStage === "COMPLETE" ? (
                          <Link className="w-5 h-5 text-green-500" />
                        ) : (
                          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        )}
                        <span className="font-medium text-gray-700">
                          {stages[linkStage]}
                        </span>
                      </div>
                      {linkStage === "COMPLETE" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {copied ? "Copied!" : "Copy Link"}
                          </span>
                        </motion.button>
                      )}
                    </div>
                    {linkStage !== "COMPLETE" && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${linkProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {imageSrc && (
                <motion.div
                  {...fadeIn}
                  className="w-full rounded-xl overflow-hidden shadow-lg"
                >
                  <ReactPhotoSphereViewer
                    src={imageSrc}
                    height="600px"
                    width="100%"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
