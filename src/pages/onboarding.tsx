import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import withAuth from "@/components/hoc/withAuth";
import { resolveLogoUrl } from "@/lib/logoUrl";

const AESTHETICS = [
  "Streetwear", "Luxury", "Minimalist", "Avant-Garde",
  "Techwear", "Y2K", "Preppy", "Workwear", "Bohemian", "Coastal",
];

const BUDGETS = [
  { label: "Under $50", value: "under $50" },
  { label: "$50 – $200", value: "$50–$200" },
  { label: "$200 – $500", value: "$200–$500" },
  { label: "$500+", value: "over $500" },
];

const VALUES = [
  "Craftsmanship", "Exclusivity", "Sustainability",
  "Trend-forward", "Timeless design", "Cultural relevance",
];

const STEPS = ["Aesthetic", "Budget", "Values"];

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  category?: string;
};

function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [aesthetics, setAesthetics] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Brand[]>([]);

  const toggleItem = (
    item: string,
    selected: string[],
    setSelected: (v: string[]) => void,
    max?: number
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else if (!max || selected.length < max) {
      setSelected([...selected, item]);
    }
  };

  const canAdvance = () => {
    if (step === 0) return aesthetics.length > 0;
    if (step === 1) return budget !== "";
    if (step === 2) return values.length > 0;
    return false;
  };

  const skip = () => router.replace("/");

  const submit = async () => {
    setLoading(true);
    try {
      const params = aesthetics.map((a) => `aesthetics=${encodeURIComponent(a)}`).join("&");

      const [profileRes, recsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/style-profile/onboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ aesthetics, budget, values }),
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/recommendations?limit=6&${params}`, {
          credentials: "include",
        }),
      ]);

      const profileData = await profileRes.json();
      const recsData = await recsRes.json();

      setProfile(profileData.style_profile ?? null);
      setRecommendations(Array.isArray(recsData) ? recsData : []);
    } catch {
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  };

  return (
    <>
      <Head>
        <title>Your Style | Switch</title>
      </Head>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {!profile && (
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-600 mb-4">
                Step {step + 1} of {STEPS.length}
              </p>
              <div className="flex items-center justify-center gap-2 mb-8">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-px transition-all duration-500 ${
                      i <= step ? "w-10 bg-white" : "w-6 bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {profile && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-600 mb-8">
                  Your style profile
                </p>
                <div className="flex items-center gap-4 justify-center mb-8">
                  <div className="h-px w-10 bg-zinc-700" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">The Edit</span>
                  <div className="h-px w-10 bg-zinc-700" />
                </div>
                <p className="text-white text-lg font-light leading-relaxed tracking-wide mb-12">
                  {profile}
                </p>

                {recommendations.length > 0 && (
                  <div className="mb-12">
                    <p className="text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-6">
                      Brands for you
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {recommendations.map((brand) => {
                        const logo = resolveLogoUrl(brand.logo_url);
                        return (
                          <Link key={brand.id} href={`/brands/${brand.id}`}>
                            <div className="aspect-square bg-white flex items-center justify-center p-3 hover:opacity-80 transition-opacity">
                              {logo ? (
                                <img src={logo} alt={brand.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-zinc-900 text-[9px] font-light tracking-widest uppercase text-center leading-tight">
                                  {brand.name}
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-zinc-600 mt-1.5 truncate">
                              {brand.name}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={() => router.replace("/favorites")}
                    className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-medium text-white hover:text-zinc-400 transition-colors"
                  >
                    <span className="w-6 h-px bg-white" />
                    View Profile
                  </button>
                  <span className="text-zinc-800">·</span>
                  <button
                    onClick={() => router.replace("/")}
                    className="text-[11px] tracking-[0.25em] uppercase font-medium text-zinc-600 hover:text-white transition-colors"
                  >
                    Explore Brands
                  </button>
                </div>
              </motion.div>
            )}

            {!profile && step === 0 && (
              <motion.div
                key="aesthetics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-light text-white tracking-tight mb-2">
                  What aesthetics speak to you?
                </h2>
                <p className="text-zinc-600 text-sm mb-8">Select all that apply.</p>
                <div className="flex flex-wrap gap-2">
                  {AESTHETICS.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleItem(item, aesthetics, setAesthetics)}
                      className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                        aesthetics.includes(item)
                          ? "border-white text-white bg-white/10"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {!profile && step === 1 && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-light text-white tracking-tight mb-2">
                  What's your typical budget per piece?
                </h2>
                <p className="text-zinc-600 text-sm mb-8">Select one.</p>
                <div className="flex flex-col gap-3">
                  {BUDGETS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setBudget(value)}
                      className={`w-full px-6 py-4 text-left text-sm tracking-[0.1em] border transition-all duration-200 ${
                        budget === value
                          ? "border-white text-white bg-white/10"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {!profile && step === 2 && (
              <motion.div
                key="values"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-light text-white tracking-tight mb-2">
                  What do you value most in a brand?
                </h2>
                <p className="text-zinc-600 text-sm mb-8">Pick up to 2.</p>
                <div className="flex flex-wrap gap-2">
                  {VALUES.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleItem(item, values, setValues, 2)}
                      className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                        values.includes(item)
                          ? "border-white text-white bg-white/10"
                          : values.length >= 2
                          ? "border-zinc-900 text-zinc-700 cursor-not-allowed"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!profile && (
            <div className="flex items-center justify-between mt-12">
              <div className="flex items-center gap-6">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-zinc-700 hover:text-zinc-400 transition-colors"
                  >
                    <span className="w-6 h-px bg-zinc-700" />
                    Back
                  </button>
                )}
                <button
                  onClick={skip}
                  className="text-[11px] tracking-[0.2em] uppercase text-zinc-700 hover:text-zinc-400 transition-colors"
                >
                  Skip
                </button>
              </div>
              <motion.button
                onClick={next}
                disabled={!canAdvance() || loading}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white hover:text-zinc-400"
              >
                {loading ? (
                  "Building your profile..."
                ) : step < STEPS.length - 1 ? (
                  <>
                    Next
                    <span className="w-6 h-px bg-white" />
                  </>
                ) : (
                  <>
                    Finish
                    <span className="w-6 h-px bg-white" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default withAuth(OnboardingPage);
