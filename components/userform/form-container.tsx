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
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-[#888] font-mono text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="min-h-screen bg-[#0e0e0e] text-[#e8e6e0] font-mono"
      >
        <div className="min-h-screen flex items-center justify-center py-4 px-4">
          <div className="flex flex-col gap-3 w-full max-w-2xl">
            {/* Progress Header - Compact */}
            <div className="flex items-center justify-between text-[10px] text-[#888] uppercase tracking-widest px-1">
              <span>Step {step + 1}/5</span>
              <span>{Math.round(((step + 1) / 5) * 100)}%</span>
            </div>

            {/* Progress Bar - Compact */}
            <div className="px-1">
              <ProgressDemo Step={step} />
            </div>

            {/* Form Content - Scrollable if needed */}
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              <CurrentComponent />
            </div>

            {/* Navigation Buttons - Compact */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 h-9 bg-[#161616] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a] font-bold text-xs tracking-widest uppercase transition-colors"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                ← Prev
              </Button>

              <Button
                type="button"
                className="flex-1 h-9 bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-xs tracking-widest uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

export default FormContainer;
