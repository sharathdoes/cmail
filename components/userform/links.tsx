"use client";

import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/storage";

const Links = () => {
  const { register } = useFormContext<User>();
  const [savedUser, setSavedUser] = useState<User | null>(null);

  useEffect(() => {
    setSavedUser(getUser());
  }, []);

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>Links</h1>
        <p style={styles.subtitle}>
          Add your professional links
        </p>
      </div>
      <div style={styles.linksSection}>
        <div style={styles.field}>
          <label style={styles.label}>
            LinkedIn
          </label>
          <Input
            placeholder="https://linkedin.com/in/username"
            {...register("linkedin_url")}
            defaultValue={savedUser?.linkedin_url || ""}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>
            GitHub
          </label>
          <Input
            placeholder="https://github.com/username"
            {...register("github_url")}
            defaultValue={savedUser?.github_url || ""}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>
            Portfolio
          </label>
          <Input
            placeholder="https://yourportfolio.com"
            {...register("portfolio_url")}
            defaultValue={savedUser?.portfolio_url || ""}
            style={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#111',
    border: '1px solid #2a2a2a',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '10px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '4px',
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '10px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
    height: '36px',
    padding: '8px 12px',
  },
};

export default Links;
