"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/storage";
import { User } from "@/lib/types";
import { toast } from "sonner";
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
    if (saved) {
      setUser(saved);
      setApiKey(saved.GroqAPI ?? "");
    }
  }, []);

  const buildPrompt = () => {
    if (!user) return "";

    return `
You are helping a job seeker write a cold email to someone at a company.

Candidate:
Name: ${user.name}
Email: ${user.email}
Primary Role: ${user.primary_role || "Software Engineer"}
Location: ${user.location || "Not specified"}
Can start: ${availabilityLabel[user.availability || "immediate"]}

Roles looking for:
${
  user.roles_looking_for
    ?.map(
      (r) =>
        `- ${r.name}
Skills: ${r.skills.join(", ")}
Projects: ${r.projects?.join(", ") || "N/A"}
Notable: ${r.mentions || "N/A"}`,
    )
    .join("\n") || "N/A"
}

Experience:
${
  user.experience
    ?.map(
      (e) =>
        `- ${e.role} at ${e.company} (${e.duration})${
          e.description ? ": " + e.description : ""
        }`,
    )
    .join("\n") || "N/A"
}

Proof points:
${user.proof_points?.join("\n") || "N/A"}

Resume summary:
${user.resume_text || "N/A"}

Links:
LinkedIn: ${user.linkedin_url || "N/A"}
GitHub: ${user.github_url || "N/A"}
Portfolio: ${user.portfolio_url || "N/A"}

Additional notes:
${user.custom_prompt || "None"}

---

Job Description:
${jobDescription}

---

Instructions:
${templates[selectedTemplate]}

Generate exactly 3 clearly separated email versions.
Label them Version 1, Version 2, Version 3.
Each under 200 words.
`;
  };

  const generateColdMails = async () => {
    if (!user || !apiKey) {
      toast("Profile incomplete", {
        description: "Please edit your profile before generating cold emails.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        style: {
          background: "orange",
          border:"black"
        },
      });
      return;
    }

    if (!apiKey || !jobDescription) return;

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
      toast("Generation failed",{
        description: "Check your API key.",
      });
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen w-full bg-[#0e0e0e] text-[#e8e6e0] font-mono flex flex-col  justify-center items-center px-6 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Title */}
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              c<span className="text-[#f5a623]">.mail</span>
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              {user ? `generating for ${user.name}` : "no profile loaded"}
            </p>
          </div>

          <button
            onClick={() => router.push("/me")}
            className="text-xs text-gray-300 hover:text-[#aaa] underline underline-offset-2"
          >
            edit profile →
          </button>
        </div>

        {/* If no user show helper box */}
        {/* {!user && (
          <div className="border border-[#2a2a2a] bg-[#111] p-4 text-sm text-[#888]">
            No profile found.
            <button
              onClick={() => router.push("/me")}
              className="text-[#f5a623] underline ml-1"
            >
              Create one →
            </button>
          </div>
        )} */}

        {/* Job Description */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#888] uppercase tracking-widest">
            Job Description / Company Context
          </label>
          <Textarea
            placeholder="Paste job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="w-full border border-[#2a2a2a] bg-[#161616] px-3 py-2.5 text-sm placeholder:text-[#444] focus:border-[#f5a623] focus:outline-none resize-y"
          />
        </div>

        {/* Template + Generate */}
        <div className="flex gap-3">
          <Select
            value={selectedTemplate}
            onValueChange={(v) => setSelectedTemplate(v as TemplateType)}
          >
            <SelectTrigger className="bg-[#161616] border-[#2a2a2a] text-white text-sm rounded-none h-10 w-44 focus:border-[#f5a623]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white rounded-none">
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="story">Story Driven</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={generateColdMails}
            disabled={loading  || !jobDescription }
            className="flex-1 h-10 rounded-none bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-sm uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate 3 ColdMails →"}
          </Button>
        </div>

        {/* Results */}
        {responses.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#2a2a2a]">
            {responses.map((res, i) => (
              <div key={i} className="border border-[#2a2a2a] bg-[#111]">
                <div className="flex justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#181818]">
                  <span className="text-xs text-[#f5a623] font-bold uppercase">
                    Version {i + 1}
                  </span>
                  <button
                    onClick={() => copyToClipboard(res, i)}
                    className="text-xs text-[#888] hover:text-white"
                  >
                    {copied === i ? "✓ copied" : "copy"}
                  </button>
                </div>
                <pre className="px-5 py-4 text-sm whitespace-pre-wrap break-words leading-relaxed max-h-[520px] overflow-auto">
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
