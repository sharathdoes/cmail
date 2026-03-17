"use client";

import { useEffect, useState } from "react";
import FormContainer from "@/components/userform/form-container";
import { getUser, clearUser } from "@/lib/storage";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import ProfileBento from "@/components/ui/profile";
export default function YouPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = getUser();
    if (saved?.GroqAPI) {
      setUser(saved);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!user || isEditing) {
    return <FormContainer />;
  }

  return (
    <div style={styles.container}>
      <ProfileBento user={user} onEdit={() => setIsEditing(true)} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
