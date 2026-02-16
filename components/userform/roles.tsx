"use client";

import { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { User } from "@/lib/types";
import { Plus, X } from "lucide-react";
import { getUser } from "@/lib/storage";

const Roles = () => {
  const { control, register, watch, setValue, reset } = useFormContext<User>();

  const [skillDrafts, setSkillDrafts] = useState<Record<number, string>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles_looking_for",
  });

  useEffect(() => {
    const savedUser = getUser();
    if (
      savedUser?.roles_looking_for &&
      savedUser.roles_looking_for.length > 0
    ) {
      reset((formValues) => ({
        ...formValues,
        roles_looking_for: savedUser.roles_looking_for,
      }));
    }
  }, [reset]);

  return (
    <div className="p-5 space-y-4 bg-[#111] border border-[#2a2a2a]">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Roles looking for
        </h1>
        <p className="text-[10px] text-[#888] uppercase tracking-widest mt-0.5">
          Add the roles you're interested in
        </p>
      </div>
      {fields.map((field, index) => {
        const skillsPath = `roles_looking_for.${index}.skills` as const;

        const skills = (watch(skillsPath) ?? []) as string[];
        const draft = skillDrafts[index] ?? "";

        const addSkill = () => {
          const trimmed = draft.trim();
          if (!trimmed) return;

          setValue(skillsPath, [...skills, trimmed]);
          setSkillDrafts((prev) => ({
            ...prev,
            [index]: "",
          }));
        };

        const removeSkill = (skillIndex: number) => {
          setValue(
            skillsPath,
            skills.filter((_, i) => i !== skillIndex),
          );
        };

        return (
          <div
            key={field.id}
            className="space-y-3 border border-[#2a2a2a] p-4 bg-[#0e0e0e]"
          >
            <Input
              placeholder="Role Name"
              {...register(`roles_looking_for.${index}.name`)}
              className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
            />

            {/* Skills */}
            <div className="space-y-2">
              <Input
                placeholder="Enter skill and press Enter"
                value={draft}
                onChange={(e) =>
                  setSkillDrafts((prev) => ({
                    ...prev,
                    [index]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm h-9 focus:border-[#f5a623] focus:ring-0"
              />

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <div
                    key={`${field.id}-skill-${i}`}
                    className="inline-flex items-center gap-1.5 border border-[#2a2a2a] px-2 py-0.5 text-[10px] text-[#aaa] uppercase tracking-wide bg-[#0e0e0e]"
                  >
                    {skill}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 hover:text-[#f5a623] hover:bg-transparent p-0"
                      onClick={() => removeSkill(i)}
                    >
                      <X size={10} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Mentions / Projects"
              {...register(`roles_looking_for.${index}.mentions`)}
              className="bg-[#161616] border-[#2a2a2a] text-white font-mono text-sm focus:border-[#f5a623] focus:ring-0 min-h-[60px]"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest h-8 px-3"
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        className="w-full h-9 bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-xs tracking-widest uppercase"
        onClick={() =>
          append({
            name: "",
            skills: [],
            resume_text: "",
            mentions: "",
          })
        }
      >
        Add Role <Plus size={14} className="ml-1.5" />
      </Button>
    </div>
  );
};

export default Roles;
