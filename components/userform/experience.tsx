"use client";

import { User } from "@/lib/types";
import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { getUser } from "@/lib/storage";

const Experiences = () => {
  const { control, register, reset } = useFormContext<User>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser?.experience && savedUser.experience.length > 0) {
      reset((formValues) => ({
        ...formValues,
        experience: savedUser.experience,
      }));
    }
  }, [reset]);

  return (
    <div className="p-5 flex flex-col gap-4 bg-[#111] border border-[#2a2a2a]">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Experience
        </h1>
        <p className="text-[10px] text-[#888] uppercase tracking-widest mt-0.5">
          Add your previous work experience
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative border border-[#2a2a2a] bg-[#0e0e0e] p-4 space-y-3"
        >
          <div className="grid gap-3">
            <Input
              placeholder="Company Name"
              {...register(`experience.${index}.company`)}
              className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Role"
                {...register(`experience.${index}.role`)}
                className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
              />
              <Input
                placeholder="Duration (e.g. Jan 2023 - Dec 2024)"
                {...register(`experience.${index}.duration`)}
                className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
              />
            </div>

            <Textarea
              placeholder="Describe your responsibilities and impact..."
              rows={3}
              {...register(`experience.${index}.description`)}
              className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm focus:border-[#f5a623] focus:ring-0 resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => remove(index)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest h-8 px-3"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({ company: "", role: "", duration: "", description: "" })
        }
        className="h-9 bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-xs tracking-widest uppercase"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
};

export default Experiences;
