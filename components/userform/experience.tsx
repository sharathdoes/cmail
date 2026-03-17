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
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>
          Experience
        </h1>
        <p style={styles.subtitle}>
          Add your previous work experience
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          style={styles.experienceCard}
        >
          <div style={styles.cardContent}>
            <Input
              placeholder="Company Name"
              {...register(`experience.${index}.company`)}
              style={styles.input}
            />

            <div style={styles.twoColumnGrid}>
              <Input
                placeholder="Role"
                {...register(`experience.${index}.role`)}
                style={styles.input}
              />
              <Input
                placeholder="Duration (e.g. Jan 2023 - Dec 2024)"
                {...register(`experience.${index}.duration`)}
                style={styles.input}
              />
            </div>

            <Textarea
              placeholder="Describe your responsibilities and impact..."
              rows={3}
              {...register(`experience.${index}.description`)}
              style={styles.textarea}
            />
            <div style={styles.removeButtonContainer}>
              <Button
                onClick={() => remove(index)}
                style={styles.removeButton}
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
        style={styles.addButton}
      >
        <Plus style={{ marginRight: '6px', height: '16px', width: '16px' }} />
        Add Experience
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
  experienceCard: {
    position: 'relative',
    border: '1px solid #2a2a2a',
    backgroundColor: '#0e0e0e',
    padding: '16px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  textarea: {
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '8px 12px',
    minHeight: 'auto',
    resize: 'none',
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

export default Experiences;
