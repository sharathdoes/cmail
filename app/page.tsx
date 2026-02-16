"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/storage";
import { User } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TemplateType = "concise" | "technical" | "story" | "bold";

const templates: Record<TemplateType, string> = {
  concise:
    "Write a concise, sharp and professional cold email from the candidate to someone at the company — asking for a referral or expressing interest in an open role.",
  technical:
    "Write a technically strong cold email from the candidate to an engineer or hiring manager at the company — highlighting systems, scalability, and engineering depth, and asking for a referral or conversation.",
  story:
    "Write a compelling narrative cold email from the candidate to someone at the company — connecting their experience to the company's mission and asking for a referral or intro call.",
  bold: "Write a confident, memorable cold email from the candidate to someone at the company — that stands out and clearly asks for a referral or a shot at the role.",
};

const availabilityLabel: Record<string, string> = {
  immediate: "immediately",
  "1_month": "within a month",
  "3_months": "within 3 months",
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("concise");
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    const saved = getUser();
    if (!saved) {
      router.push("/me");
      return;
    }
    setUser(saved);
    setApiKey(saved.GroqAPI ?? "");
  }, []);

  const buildPrompt = () => {
    if (!user) return "";

    return `
You are helping a job seeker write a cold email to someone at a company — either asking for a referral, expressing interest in an open role, or requesting an intro call.

The email is written FROM the candidate TO a person at the company (recruiter, engineer, hiring manager, etc.).
The candidate is NOT a recruiter. They are a job seeker reaching out for an opportunity or referral.
Do NOT write it as if the candidate is hiring someone. Do NOT write it as if the candidate is a recruiter.

---

Candidate (the person writing the email):
Name: ${user.name}
Email: ${user.email}
Primary Role: ${user.primary_role || "Software Engineer"}
Location: ${user.location || "Not specified"}
Can start: ${availabilityLabel[user.availability || "immediate"]}

What they're looking for:
${user.roles_looking_for
  .map(
    (r) =>
      `- Role: ${r.name}
  Skills: ${r.skills.join(", ")}
  Projects: ${r.projects?.join(", ") || "N/A"}
  Notable: ${r.mentions || "N/A"}`,
  )
  .join("\n")}

Past Experience:
${user.experience
  .map(
    (e) =>
      `- ${e.role} at ${e.company} (${e.duration})${
        e.description ? ": " + e.description : ""
      }`,
  )
  .join("\n")}

Key proof points / achievements:
${user.proof_points?.join("\n") || "N/A"}

Resume summary:
${user.resume_text}

Links:
LinkedIn: ${user.linkedin_url || "N/A"}
GitHub: ${user.github_url || "N/A"}
Portfolio: ${user.portfolio_url || "N/A"}

Additional notes from candidate:
${user.custom_prompt || "None"}

---

Job Description / Company they're reaching out to:
${jobDescription}

---

Instructions:
${templates[selectedTemplate]}

Generate exactly 3 clearly separated email versions. Label them "Version 1", "Version 2", "Version 3".
Each should have a Subject line and full email body.
Make them natural, human, and specific to this job description and company.
Each version should feel distinct — vary the opening hook, tone, and CTA.
Do NOT sound generic. Do NOT use filler phrases like "I hope this email finds you well."
The candidate is reaching out asking for an opportunity or referral — NOT offering one.
Keep each email under 200 words.
`;
  };

  const generateColdMails = async () => {
    if (!apiKey || !jobDescription || !user) return;
    setLoading(true);
    setResponses([]);

    try {
      const prompt = buildPrompt();
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const text: string = res.data.choices[0].message.content;

      // Split on Version 1 / Version 2 / Version 3 markers
      const versionRegex = /Version\s+[123][:\.\-]?\s*/gi;
      const parts = text.split(versionRegex).filter((s) => s.trim().length > 0);
      const versions = parts.slice(0, 3);

      setResponses(
        versions.length >= 2
          ? versions
          : text.split(/\n\s*\n\s*\n/).slice(0, 3),
      );
    } catch (err) {
      console.error(err);
      alert("Generation failed. Check your API key.");
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!user) return null;

  return (
    <main
      className={`min-h-screen w-full bg-[#0e0e0e] text-[#e8e6e0] font-mono flex flex-col items-center px-6 ${responses.length > 0 ? "justify-start py-12" : "justify-center py-12"}`}
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Title block */}
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              c<span className="text-[#f5a623]">.mail</span>
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              generating for <span className="text-[#f5a623]">{user.name}</span>
            </p>
          </div>
          <button
            onClick={() => router.push("/me")}
            className="text-xs text-gray-300 hover:text-[#aaa] transition-colors underline underline-offset-2"
          >
            edit profile →
          </button>
        </div>
        {/* API Key */}

        {/* Job Description */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#888] uppercase tracking-widest">
            Job Description / Company Context
          </label>
          <Textarea
            placeholder="Paste the job description, LinkedIn post, or just describe the company and role you're targeting..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            style={{ color: "#e8e6e0", backgroundColor: "#161616" }}
            className="w-full border border-[#2a2a2a] px-3 py-2.5 font-mono text-sm placeholder:text-[#444] focus:border-[#f5a623] focus:outline-none resize-y"
          />
        </div>

        {/* Template + Generate */}
        <div className="flex gap-3">
          <Select
            value={selectedTemplate}
            onValueChange={(v) => setSelectedTemplate(v as TemplateType)}
          >
            <SelectTrigger className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm rounded-none h-10 w-44 focus:ring-0 focus:outline-none focus:border-[#f5a623]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white font-mono rounded-none">
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="story">Story Driven</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={generateColdMails}
            disabled={loading || !apiKey || !jobDescription}
            className="flex-1 h-10 rounded-none bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-sm tracking-wider uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate 3 ColdMails →"
            )}
          </Button>
        </div>

        {/* Results */}
        {responses.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#2a2a2a]">
            <p className="text-xs text-[#888] uppercase tracking-widest">
              Generated Emails
            </p>
            {responses.map((res, i) => (
              <div key={i} className="border border-[#2a2a2a] bg-[#111]">
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#181818]">
                  <span className="text-xs text-[#f5a623] font-bold uppercase tracking-widest">
                    Version {i + 1}
                  </span>
                  <button
                    onClick={() => copyToClipboard(res, i)}
                    className="text-xs text-[#888] hover:text-white transition-colors"
                  >
                    {copied === i ? "✓ copied" : "copy"}
                  </button>
                </div>
                {/* Email body */}
                <pre
                  style={{ color: "#e8e6e0" }}
                  className="px-5 py-4 text-sm whitespace-pre-wrap break-words font-mono leading-relaxed overflow-auto max-h-[520px]"
                >
                  {res.trim()}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
