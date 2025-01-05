import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface LinkGeneratorProps {
  imageUrl: string;
}

const LinkGenerator = ({ imageUrl }: LinkGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2">
        <input 
          type="text"
          value={imageUrl}
          readOnly
          className="flex-1 p-2 border rounded bg-white"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LinkGenerator;