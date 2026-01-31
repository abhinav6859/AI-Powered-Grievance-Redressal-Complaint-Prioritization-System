import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phone) return;
    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) setStep(2);
      else alert("Failed to send OTP. Please try again.");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("citizen", JSON.stringify(data.citizen));
        navigate("/home");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">

      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wide mb-4">
            LokSeva AI
          </h1>
          <p className="text-lg opacity-90 mb-8">
            AI-Powered Citizen Grievance Redressal Platform
          </p>

          <div className="space-y-6">
            <Feature
              title="AI-Assisted Complaints"
              desc="Automatically draft grievances using AI for clarity and speed."
            />
            <Feature
              title="Priority-Based Resolution"
              desc="Urgent complaints are detected and escalated instantly."
            />
            <Feature
              title="Real-Time Tracking"
              desc="Track complaint progress transparently at every stage."
            />
          </div>
        </div>

        <div className="text-sm opacity-80">
          <p className="uppercase tracking-wider mb-2">Trusted By</p>
          <div className="flex gap-6 font-semibold">
            <span>GovTech</span>
            <span>IndiaStack</span>
            <span>CivicLabs</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Citizen Login</h2>
            <p className="text-sm opacity-80 mt-1">
              Secure OTP-based authentication
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <div className={`h-2 w-8 rounded-full ${step === 1 ? "bg-white" : "bg-white/30"}`} />
              <div className={`h-2 w-8 rounded-full ${step === 2 ? "bg-white" : "bg-white/30"}`} />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs uppercase opacity-80">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                  className="w-full mt-2 p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <button
                onClick={sendOtp}
                className="w-full py-3 rounded-lg bg-white text-purple-700 font-bold hover:scale-[1.02] active:scale-95 transition-all"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs uppercase opacity-80">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full mt-2 p-3 text-center tracking-widest text-lg rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <button
                onClick={verifyOtp}
                className="w-full py-3 rounded-lg bg-white text-purple-700 font-bold hover:scale-[1.02] active:scale-95 transition-all"
              >
                Verify & Login
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-sm underline opacity-80 hover:opacity-100"
              >
                Change Phone Number
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm opacity-80">
            <span>Only want to track?</span>{" "}
            <button
              onClick={() => navigate("/track")}
              className="font-semibold underline hover:opacity-100"
            >
              Track Grievance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-white/80 text-sm">{desc}</p>
    </div>
  );
}
