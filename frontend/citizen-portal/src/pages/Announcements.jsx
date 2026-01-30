import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

/* Animations */
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API}/api/announcements`);
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  /* Loading State */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f4f7] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-3">📢</div>
          <p className="text-gray-600">Loading official announcements…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#f2f4f7] px-6 py-10"
    >
      {/* PAGE HEADER */}
      <motion.div variants={item} className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📢</span>
          <h2 className="text-2xl font-bold text-gray-800">
            Official Announcements
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Government notices, circulars, and system updates
        </p>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto">
        {announcements.length === 0 ? (
          <motion.p
            variants={item}
            className="text-center text-gray-600 bg-white border p-6"
          >
            No announcements have been published yet.
          </motion.p>
        ) : (
          <motion.div variants={container} className="space-y-6">
            {announcements.map((a) => (
              <motion.div
                key={a._id}
                variants={item}
                className="bg-white border border-gray-200 shadow-sm"
              >
                {/* CARD HEADER */}
                <div className="border-b px-6 py-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span>📄</span> {a.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span>🕒</span>
                      {new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                    Notice
                  </span>
                </div>

                {/* CONTENT */}
                <div className="px-6 py-5 text-gray-700 leading-relaxed text-sm">
                  {a.content}
                </div>

                {/* ATTACHMENTS */}
                {a.attachments?.length > 0 && (
                  <div className="px-6 py-4 border-t bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <span>📎</span> Attachments
                    </p>
                    <ul className="space-y-1">
                      {a.attachments.map((file, i) => (
                        <li
                          key={i}
                          className="text-sm text-blue-700 hover:underline flex items-center gap-2"
                        >
                          <span>📁</span> {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Announcements;
