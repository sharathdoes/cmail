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
    <div className="flex flex-col gap-3 p-5 bg-[#111] border border-[#2a2a2a]">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">Links</h1>
        <p className="text-[10px] text-[#888] uppercase tracking-widest mt-0.5">
          Add your professional links
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#888] uppercase tracking-widest">
            LinkedIn
          </label>
          <Input
            placeholder="https://linkedin.com/in/username"
            {...register("linkedin_url")}
            defaultValue={savedUser?.linkedin_url || ""}
            className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#888] uppercase tracking-widest">
            GitHub
          </label>
          <Input
            placeholder="https://github.com/username"
            {...register("github_url")}
            defaultValue={savedUser?.github_url || ""}
            className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#888] uppercase tracking-widest">
            Portfolio
          </label>
          <Input
            placeholder="https://yourportfolio.com"
            {...register("portfolio_url")}
            defaultValue={savedUser?.portfolio_url || ""}
            className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Links;
