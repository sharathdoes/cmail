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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Let's start with the basics
        </h1>
        <h2 style={styles.subtitle}>
          Tell us who you are and your details
        </h2>
      </div>
      <div style={styles.formFields}>
        <div style={styles.field}>
          <label style={styles.label}>
            Full Name
          </label>
          <Input
            {...register("name")}
            placeholder={savedUser?.name || "Full name"}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>
            Email Address
          </label>
          <Input
            type="email"
            {...register("email")}
            placeholder={savedUser?.email || "Email address"}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>
            Availability
          </label>
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger style={styles.selectTrigger}>
                  <SelectValue placeholder={availabilityPlaceholder} />
                </SelectTrigger>
                <SelectContent style={styles.selectContent}>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="3_months">3 Months</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: '#111',
    border: '1px solid #2a2a2a',
  },
  header: {
    marginBottom: '16px',
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
  formFields: {
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
  selectTrigger: {
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
    height: '36px',
    borderRadius: 0,
  },
  selectContent: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontFamily: 'monospace',
    borderRadius: 0,
  },
};

export default Basics;
