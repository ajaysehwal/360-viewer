"use client";
import { useEffect, useState } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { decrypt, key, iv } from "@/utils";
import { notFound, useParams } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function View() {
  const params = useParams();
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const loadImage = async () => {
    try {
      if (!params.id) return notFound();
      const url = decrypt(params.id as string, key, iv);
      if (!url) return notFound();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, content] = url.split("appspot.com/");
      setImageSrc(`${process.env.NEXT_PUBLIC_HOME}/3d/${content}`);
    } catch (err) {
      setError(`Invalid URL-${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImage();
  }, [params.id]);
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg animate-pulse">
          Loading your 360° view...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={loadImage}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      {imageSrc && (
        <ReactPhotoSphereViewer
          src={imageSrc}
          height="100vh"
          width="100%"
          container="div"
          containerClass="absolute inset-0"
          loadingImg="/loading.gif"
        />
      )}
    </div>
  );
}
