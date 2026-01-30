import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* Animations */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="bg-[#f2f4f7] min-h-screen"
    >

      {/* HERO / TOP BANNER */}
      <motion.section
        variants={fadeUp}
        className="bg-[#000080] text-white px-6 py-16"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-200 mb-4">
              <GovIcon />
              <span>Government of India | Smart India Hackathon</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              AI-Based Grievance <br /> Redressal System
            </h1>

            <p className="mt-4 text-gray-200 max-w-xl">
              A unified digital platform to register, track, and resolve civic
              grievances with transparency, accountability, and AI-driven
              prioritization.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ShieldIcon /> Citizen Benefits
            </h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex gap-2"><CheckIcon /> Online grievance registration</li>
              <li className="flex gap-2"><CheckIcon /> Real-time complaint tracking</li>
              <li className="flex gap-2"><CheckIcon /> Automated status updates</li>
              <li className="flex gap-2"><CheckIcon /> Transparent resolution</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* CITIZEN ACTIONS */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-14"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <ServiceIcon /> Citizen Services
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <ServiceCard
            icon={<ComplaintIcon />}
            title="Register a Grievance"
            desc="Submit complaints related to roads, water supply, electricity, sanitation, and other civic issues."
            to="/submit"
            button="Submit Complaint"
          />

          <ServiceCard
            icon={<TrackIcon />}
            title="Track Complaint Status"
            desc="Monitor the progress, department actions, and resolution timeline of your grievance."
            to="/track"
            button="Track Status"
          />
        </div>
      </motion.section>

      {/* SYSTEM FEATURES */}
      <motion.section
        variants={fadeUp}
        className="bg-white border-t px-6 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <SystemIcon /> System Capabilities
          </h3>
          <p className="text-sm text-gray-500 mb-10">
            Designed for efficiency, transparency, and administrative control.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <FeatureItem
              icon={<AIIcon />}
              title="AI-Driven Prioritization"
              desc="Automatically identifies and escalates critical grievances."
            />
            <FeatureItem
              icon={<RouteIcon />}
              title="Department Mapping"
              desc="Intelligent routing to the correct authority without delays."
            />
            <FeatureItem
              icon={<MonitorIcon />}
              title="Real-Time Monitoring"
              desc="Live dashboards for officers and administrators."
            />
            <FeatureItem
              icon={<AuditIcon />}
              title="Audit & Accountability"
              desc="Complete activity logs ensuring transparency and compliance."
            />
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        variants={fadeUp}
        className="bg-gray-100 px-6 py-8 text-center text-sm text-gray-600"
      >
        © 2026 Government of India | Developed under Smart India Hackathon
      </motion.footer>
    </motion.div>
  );
}

/* ---------- COMPONENTS ---------- */

function ServiceCard({ icon, title, desc, to, button }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="bg-white border shadow-sm p-6 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10  bg-[#000080] text-white flex items-center justify-center rounded">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-gray-800">
          {title}
        </h4>
      </div>

      <p className="text-sm text-gray-600 flex-grow">
        {desc}
      </p>

      <Link
        to={to}
        className="mt-6 inline-block text-center py-2.5 border rounded border-[#1b1bbb] text-[#000080] font-medium hover:bg-[#000080] hover:text-white transition"
      >
        {button}
      </Link>
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-3">
      <div className="text-[#000080] mt-1">{icon}</div>
      <div>
        <h5 className="font-semibold text-gray-800 mb-1">
          {title}
        </h5>
        <p className="text-sm text-gray-600">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- ICONS (SVG) ---------- */

const GovIcon = () => <span className="text-lg">🏛️</span>;
const ShieldIcon = () => <span>🛡️</span>;
const CheckIcon = () => <span>✔️</span>;
const ServiceIcon = () => <span>🧾</span>;
const ComplaintIcon = () => <span>📄</span>;
const TrackIcon = () => <span>📊</span>;
const SystemIcon = () => <span>⚙️</span>;
const AIIcon = () => <span>🤖</span>;
const RouteIcon = () => <span>🗂️</span>;
const MonitorIcon = () => <span>📈</span>;
const AuditIcon = () => <span>📜</span>;

export default Home;
