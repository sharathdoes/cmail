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
    <div className="p-5 space-y-4 bg-[#111] border border-[#2a2a2a]">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Custom Prompt
        </h1>
        <p className="text-[10px] text-[#888] uppercase tracking-widest mt-0.5">
          Customize your coldmail with your own idea
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-[#888] uppercase tracking-widest">
          Custom Instructions (Optional)
        </label>
        <Textarea
          placeholder="Example: 'Generate a strong cold email for backend roles focusing on distributed systems experience.'"
          className="min-h-[80px] bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm focus:border-[#f5a623] focus:ring-0 resize-none"
          {...register("custom_prompt")}
          defaultValue={savedUser?.custom_prompt || ""}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-[#888] uppercase tracking-widest">
          Groq API Key
        </label>
        <Input
          type="password"
          placeholder="gsk_..."
          {...register("GroqAPI")}
          defaultValue={savedUser?.GroqAPI || ""}
          className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
        />
        <p className="text-[10px] text-[#555] mt-0.5">
          Get your free API key from{" "}
          <a
            href="https://console.groq.com"
            target="_blank"
            className="text-[#f5a623] hover:underline"
          >
            console.groq.com
          </a>
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-10 bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-sm tracking-widest uppercase transition-colors"
      >
        Submit & Generate →
      </Button>
    </div>
  );
};

export default Preview;
