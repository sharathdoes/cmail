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
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>c<span style={styles.titleAccent}>.mail</span></h1>
            <p style={styles.subtitle}>
              {user ? `generating for ${user.name}` : "no profile loaded"}
            </p>
          </div>

          <button
            onClick={() => router.push("/me")}
            style={styles.editButton}
          >
            edit profile →
          </button>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>
            Job Description / Company Context
          </label>
          <Textarea
            placeholder="Paste job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            style={styles.textarea}
          />
        </div>

        <div style={styles.controls}>
          <Select
            value={selectedTemplate}
            onValueChange={(v) => setSelectedTemplate(v as TemplateType)}
          >
            <SelectTrigger style={styles.selectTrigger}>
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent style={styles.selectContent}>
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="story">Story Driven</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={generateColdMails}
            disabled={loading || !jobDescription}
            style={{
              ...styles.generateButton,
              opacity: loading || !jobDescription ? 0.4 : 1,
              cursor: loading || !jobDescription ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Generating..." : "Generate 3 ColdMails →"}
          </Button>
        </div>

        {responses.length > 0 && (
          <div style={styles.resultsSection}>
            {responses.map((res, i) => (
              <div key={i} style={styles.resultCard}>
                <div style={styles.resultHeader}>
                  <span style={styles.versionLabel}>
                    Version {i + 1}
                  </span>
                  <button
                    onClick={() => copyToClipboard(res, i)}
                    style={styles.copyButton}
                  >
                    {copied === i ? "✓ copied" : "copy"}
                  </button>
                </div>
                <pre style={styles.resultText}>
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

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0e0e0e',
    color: '#e8e6e0',
    fontFamily: 'monospace',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px 24px',
  },
  container: {
    width: '100%',
    maxWidth: '42rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '-0.02em',
    color: 'white',
  },
  titleAccent: {
    color: '#f5a623',
  },
  subtitle: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
  editButton: {
    fontSize: '12px',
    color: '#999',
    textDecoration: 'underline',
    textDecorationOffset: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  textarea: {
    width: '100%',
    border: '1px solid #2a2a2a',
    backgroundColor: '#161616',
    padding: '10px 12px',
    fontSize: '14px',
    color: 'white',
    fontFamily: 'monospace',
    minHeight: '128px',
    resize: 'vertical',
  },
  controls: {
    display: 'flex',
    gap: '12px',
  },
  selectTrigger: {
    backgroundColor: '#161616',
    borderColor: '#2a2a2a',
    color: 'white',
    fontSize: '14px',
    borderRadius: 0,
    height: '40px',
    width: '176px',
  },
  selectContent: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    color: 'white',
    borderRadius: 0,
  },
  generateButton: {
    flex: 1,
    height: '40px',
    borderRadius: 0,
    backgroundColor: '#f5a623',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
  },
  resultsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #2a2a2a',
  },
  resultCard: {
    border: '1px solid #2a2a2a',
    backgroundColor: '#111',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderBottom: '1px solid #2a2a2a',
    backgroundColor: '#181818',
  },
  versionLabel: {
    fontSize: '12px',
    color: '#f5a623',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  copyButton: {
    fontSize: '12px',
    color: '#888',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  resultText: {
    padding: '20px',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.6,
    maxHeight: '520px',
    overflow: 'auto',
    color: '#e8e6e0',
  },
};
