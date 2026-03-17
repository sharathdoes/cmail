"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { User } from "@/lib/types";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { saveUser, getUser } from "@/lib/storage";
import { Input } from "../ui/input";

const Preview = () => {
  const { register, handleSubmit } = useFormContext<User>();
  const [savedUser, setSavedUser] = useState<User | null>(null);

  useEffect(() => {
    setSavedUser(getUser());
  }, []);

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>
          Custom Prompt
        </h1>
        <p style={styles.subtitle}>
          Customize your coldmail with your own idea
        </p>
      </div>
      <div style={styles.field}>
        <label style={styles.label}>
          Custom Instructions (Optional)
        </label>
        <Textarea
          placeholder="Example: 'Generate a strong cold email for backend roles focusing on distributed systems experience.'"
          style={styles.textarea}
          {...register("custom_prompt")}
          defaultValue={savedUser?.custom_prompt || ""}
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label}>
          Groq API Key
        </label>
        <Input
          type="password"
          placeholder="gsk_..."
          {...register("GroqAPI")}
          defaultValue={savedUser?.GroqAPI || ""}
          style={styles.input}
        />
        <p style={styles.helpText}>
          Get your free API key from{" "}
          <a
            href="https://console.groq.com"
            target="_blank"
            style={styles.link}
          >
            console.groq.com
          </a>
        </p>
      </div>

      <Button
        type="submit"
        style={styles.submitButton}
      >
        Submit & Generate →
      </Button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  textarea: {
    minHeight: '80px',
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '8px 12px',
    resize: 'none',
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
  helpText: {
    fontSize: '10px',
    color: '#555',
    marginTop: '4px',
  },
  link: {
    color: '#f5a623',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  submitButton: {
    width: '100%',
    height: '40px',
    backgroundColor: '#f5a623',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Preview;
