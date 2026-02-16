"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { FileUploadDemo } from "@/components/userform/file-upload";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFormContext, Controller } from "react-hook-form";
import { User } from "@/lib/types";
import { getUser } from "@/lib/storage";

const Basics = () => {
  const { register, control } = useFormContext<User>();
  const [savedUser, setSavedUser] = useState<User | null>(null);

  useEffect(() => {
    setSavedUser(getUser());
  }, []);

  const availabilityPlaceholder = savedUser?.availability
    ? {
        immediate: "Immediate",
        "1_month": "1 Month",
        "3_months": "3 Months",
      }[savedUser.availability]
    : "Select availability";

  return (
    <div className="px-5 py-4 bg-[#111] border border-[#2a2a2a]">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-white tracking-tight">
          Let's start with the basics
        </h1>
        <h2 className="text-[10px] text-[#888] uppercase tracking-widest mt-0.5">
          Tell us who you are and your details
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#888] uppercase tracking-widest">
            Full Name
          </label>
          <Input
            {...register("name")}
            placeholder={savedUser?.name || "Full name"}
            className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#888] uppercase tracking-widest">
            Email Address
          </label>
          <Input
            type="email"
            {...register("email")}
            placeholder={savedUser?.email || "Email address"}
            className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-[#888] uppercase tracking-widest">
            Availability
          </label>
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:ring-0 focus:border-[#f5a623]">
                  <SelectValue placeholder={availabilityPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white font-mono">
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="3_months">3 Months</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* <div className="flex flex-col pt-1 gap-1.5">
          <div className="border border-[#2a2a2a] bg-[#0e0e0e]">
            <div className="px-4 py-2 border-b border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-white">Upload Resume</h3>
            
            </div>
            <div className="px-4">
              <FileUploadDemo />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Basics;
