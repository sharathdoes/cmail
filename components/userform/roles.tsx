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
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>
          Roles looking for
        </h1>
        <p style={styles.subtitle}>
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
            style={styles.roleCard}
          >
            <Input
              placeholder="Role Name"
              {...register(`roles_looking_for.${index}.name`)}
              style={styles.input}
            />

            <div style={styles.skillsSection}>
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
                style={styles.input}
              />

              <div style={styles.skillTags}>
                {skills.map((skill, i) => (
                  <div
                    key={`${field.id}-skill-${i}`}
                    style={styles.skillTag}
                  >
                    {skill}
                    <Button
                      type="button"
                      style={styles.skillRemoveButton}
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
              style={styles.textarea}
            />
            <div style={styles.removeButtonContainer}>
              <Button
                type="button"
                style={styles.removeButton}
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        style={styles.addButton}
        onClick={() =>
          append({
            name: "",
            skills: [],
            resume_text: "",
            mentions: "",
          })
        }
      >
        Add Role <Plus size={14} style={{ marginLeft: '6px' }} />
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
  roleCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid #2a2a2a',
    padding: '16px',
    backgroundColor: '#0e0e0e',
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
  skillsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid #2a2a2a',
    padding: '4px 8px',
    fontSize: '10px',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#0e0e0e',
  },
  skillRemoveButton: {
    height: '16px',
    width: '16px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textarea: {
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '8px 12px',
    minHeight: '60px',
    resize: 'vertical',
  },
  removeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  removeButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    height: '32px',
    padding: '0 12px',
    border: 'none',
    cursor: 'pointer',
  },
  addButton: {
    width: '100%',
    height: '36px',
    backgroundColor: '#f5a623',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Roles;
