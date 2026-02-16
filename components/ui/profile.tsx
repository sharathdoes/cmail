import { User } from "@/lib/types";
import { clearUser } from "@/lib/storage";

const availabilityLabel: Record<string, string> = {
  immediate: "Available immediately",
  "1_month": "Available within a month",
  "3_months": "Available within 3 months",
};

interface ProfileBentoProps {
  user: User;
  onEdit: () => void;
}

export default function ProfileBento({ user, onEdit }: ProfileBentoProps) {
  return (
    <main className="h-screen w-full bg-[#0e0e0e] text-[#e8e6e0] font-mono flex flex-col items-center justify-center ">
      <div className="w-full max-w-2xl ">
        {/* Top bar */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-[#555] uppercase tracking-widest mb-1">
              your profile
            </p>
            <h1 className="text-2xl font-bold text-white leading-none">
              {user.name}
            </h1>
            <p className="text-sm text-[#f5a623] mt-1">{user.email}</p>
          </div>
          <button
            onClick={onEdit}
            className="text-xs border border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-black transition-colors px-4 py-2 uppercase tracking-widest"
          >
            Edit Profile
          </button>
        </div>

        {/* Row 1: Role + Location | Availability */}
        <div className="grid grid-cols-3 gap-1">
          <div className="col-span-2 bg-[#111] border border-[#1f1f1f] px-5 py-4">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
              Role
            </p>
            <p className="text-white font-semibold text-base">
              {user.primary_role || "—"}
            </p>
            {user.location && (
              <p className="text-xs text-[#888] mt-1.5">📍 {user.location}</p>
            )}
          </div>
          <div className="bg-[#111] border border-[#1f1f1f] px-5 py-4">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
              Availability
            </p>
            <p className="text-[#f5a623] text-sm leading-snug">
              {availabilityLabel[user.availability || "immediate"]}
            </p>
          </div>
        </div>

        {/* Row 2: Roles looking for */}
        <div className="bg-[#111] border border-[#1f1f1f] px-5 py-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-3">
            Looking For
          </p>
          {user.roles_looking_for.length > 0 ? (
            <div className="space-y-3">
              {user.roles_looking_for.map((role, i) => (
                <div key={i}>
                  <span className="text-white text-sm font-semibold">
                    {role.name}
                  </span>
                  {role.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {role.skills.map((skill, j) => (
                        <span
                          key={j}
                          className="text-[10px] px-2 py-0.5 border border-[#2a2a2a] text-[#aaa] uppercase tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#555]">No roles added</p>
          )}
        </div>

        {/* Row 3: Experience | Links */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-[#111] border border-[#1f1f1f] px-5 py-4 overflow-auto max-h-48">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-3">
              Experience
            </p>
            {user.experience.length > 0 ? (
              <div className="space-y-3">
                {user.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="text-white text-sm font-medium">{exp.role}</p>
                    <p className="text-[#888] text-xs">
                      {exp.company} · {exp.duration}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#555]">No experience added</p>
            )}
          </div>

          <div className="bg-[#111] border border-[#1f1f1f] px-5 py-4">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-3">
              Links
            </p>
            <div className="space-y-2.5 text-sm">
              {user.linkedin_url ? (
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  className="flex items-center gap-2 text-[#888] hover:text-[#f5a623] transition-colors"
                >
                  <span className="text-[#333]">↗</span> LinkedIn
                </a>
              ) : (
                <p className="text-[#333] text-xs">No LinkedIn</p>
              )}
              {user.github_url ? (
                <a
                  href={user.github_url}
                  target="_blank"
                  className="flex items-center gap-2 text-[#888] hover:text-[#f5a623] transition-colors"
                >
                  <span className="text-[#333]">↗</span> GitHub
                </a>
              ) : (
                <p className="text-[#333] text-xs">No GitHub</p>
              )}
              {user.portfolio_url ? (
                <a
                  href={user.portfolio_url}
                  target="_blank"
                  className="flex items-center gap-2 text-[#888] hover:text-[#f5a623] transition-colors"
                >
                  <span className="text-[#333]">↗</span> Portfolio
                </a>
              ) : (
                <p className="text-[#333] text-xs">No Portfolio</p>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Resume summary */}
        {user.resume_text && (
          <div className="bg-[#111] border border-[#1f1f1f] px-5 py-4 max-h-36 overflow-auto">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
              Resume Summary
            </p>
            <p className="text-sm text-[#aaa] whitespace-pre-wrap leading-relaxed">
              {user.resume_text}
            </p>
          </div>
        )}

        {/* Row 5: Custom prompt */}
        {user.custom_prompt && (
          <div className="bg-[#111] border border-[#1f1f1f] px-5 py-4">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
              Custom Instructions
            </p>
            <p className="text-sm text-[#aaa] whitespace-pre-wrap leading-relaxed">
              {user.custom_prompt}
            </p>
          </div>
        )}

        {/* Generate button */}
        <div className="pt-3">
          <a
            href="/"
            className="block w-full text-center bg-[#f5a623] hover:bg-[#e09510] text-black font-bold text-sm tracking-widest uppercase py-3 transition-colors"
          >
            Generate ColdMails →
          </a>
        </div>
      </div>
    </main>
  );
}
