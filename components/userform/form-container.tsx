"use client";

import Basics from "./basics";
import Roles from "./roles";
import Experiences from "./experience";
import Links from "./links";
import Preview from "./preview";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ProgressDemo from "./progressbar";
import { useForm, FormProvider } from "react-hook-form";
import { User } from "@/lib/types";
import { getUser, saveUser } from "@/lib/storage";
import { useRouter } from "next/navigation";

const FormContainer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      resume_text: "",
      roles_looking_for: [],
      experience: [],
      proof_points: [],
      availability: "immediate",
      GroqAPI: "",
    },
  });

  useEffect(() => {
    const existingUser = getUser();
    if (existingUser) {
      methods.reset(existingUser);
    }
    setIsLoading(false);
  }, [methods]);

  const FormComponents = [
    { component: Basics, title: "Basics" },
    { component: Roles, title: "Roles" },
    { component: Experiences, title: "Experiences" },
    { component: Links, title: "Links" },
    { component: Preview, title: "Preview" },
  ];

  const [step, setStep] = useState<number>(0);
  const CurrentComponent = FormComponents[step].component;
  const router = useRouter();

  const validateStep = async () => {
    const fields = {
      0: ["name", "email", "GroqAPI"],
      1: ["roles_looking_for"],
      2: ["experience"],
      3: [],
      4: [],
    };

    const fieldsToValidate = fields[step as keyof typeof fields];
    return await methods.trigger(fieldsToValidate as any);
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep(Math.min(4, step + 1));
    }
  };

  const onSubmit = (data: User) => {
    saveUser(data);
    console.log("🔥 FINAL FORM DATA:", data);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={styles.form}
      >
        <div style={styles.formContent}>
          <div style={styles.formInner}>
            <div style={styles.progressHeader}>
              <span>Step {step + 1}/5</span>
              <span>{Math.round(((step + 1) / 5) * 100)}%</span>
            </div>

            <div style={styles.progressContainer}>
              <ProgressDemo Step={step} />
            </div>

            <div style={styles.componentContainer}>
              <CurrentComponent />
            </div>

            <div style={styles.buttonGroup}>
              <Button
                type="button"
                style={{
                  ...styles.prevButton,
                  opacity: step === 0 ? 0.4 : 1,
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                }}
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                ← Prev
              </Button>

              <Button
                type="button"
                style={{
                  ...styles.nextButton,
                  opacity: step === 4 ? 0.4 : 1,
                  cursor: step === 4 ? 'not-allowed' : 'pointer',
                }}
                disabled={step === 4}
                onClick={handleNext}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#0e0e0e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  form: {
    minHeight: '100vh',
    backgroundColor: '#0e0e0e',
    color: '#e8e6e0',
    fontFamily: 'monospace',
  },
  formContent: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  formInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '56rem',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  progressContainer: {
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  componentContainer: {
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  prevButton: {
    flex: 1,
    height: '36px',
    backgroundColor: '#161616',
    border: '1px solid #2a2a2a',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
  },
  nextButton: {
    flex: 1,
    height: '36px',
    backgroundColor: '#f5a623',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: 'none',
    cursor: 'pointer',
  },
};

export default FormContainer;
