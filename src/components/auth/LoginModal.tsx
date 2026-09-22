import { useState } from "react";
import {
  Building2,
  Check,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_STUDENTS, StudentUser, createMockUserFromEmail } from "@/lib/auth";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser) => void;
};

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("std-01");
  const [email, setEmail] = useState<string>("an.nv210012@sis.edu.vn");
  const [password, setPassword] = useState<string>("********");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<"idle" | "verifying" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (student: StudentUser) => {
    setSelectedPresetId(student.id);
    setEmail(student.email);
    setPassword("UniCourse@2026");
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập email do trường cấp.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("Email không hợp lệ. Vui lòng nhập định dạng email trường (ví dụ: ten.sv@sis.edu.vn).");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoginStep("verifying");

    // Simulate realistic university CAS/LDAP SSO authentication latency
    setTimeout(() => {
      setLoginStep("success");
      const user = createMockUserFromEmail(email);

      setTimeout(() => {
        setIsLoading(false);
        setLoginStep("idle");
        onLoginSuccess(user);
        onClose();
      }, 500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-[2px] animate-overlay-in motion-reduce:animate-none"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-modal-enter motion-reduce:animate-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative border-b border-border bg-muted/40 p-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Đóng"
          >
            <X className="size-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground">Cổng Xác Thực Đào Tạo</h2>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  SSO UniID
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Đăng nhập bằng tài khoản email trường để đăng ký học phần
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Quick Login Preset Selection */}
          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Chọn tài khoản sinh viên thử nghiệm:
              </label>
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                <Sparkles className="size-3" /> 1-Click Fast Login
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {MOCK_STUDENTS.map((std) => {
                const isSelected = selectedPresetId === std.id && email === std.email;
                return (
                  <button
                    key={std.id}
                    type="button"
                    onClick={() => handleSelectPreset(std)}
                    className={`flex flex-col rounded-lg border p-2.5 text-left transition-all duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground truncate">{std.name}</span>
                      {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                    </div>
                    <span className="mt-1 text-[10px] font-semibold text-primary">{std.studentId}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{std.faculty} · {std.cohort.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                Email trường (@sis.edu.vn / @...edu.vn)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedPresetId("");
                    setErrorMessage(null);
                  }}
                  placeholder="masv@sis.edu.vn"
                  className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Mật khẩu tài khoản đào tạo
                </label>
                <span className="text-[10px] text-muted-foreground">Mặc định: bất kỳ</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                  disabled={isLoading}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="rounded-md border border-border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-3.5 text-success" />
                <span>Bảo mật hệ thống đại học</span>
              </div>
              Xác thực SSO phân quyền sinh viên, kiểm tra điều kiện tiên quyết và kiểm soát tín chỉ theo đúng chương trình đào tạo.
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-bold"
              disabled={isLoading}
            >
              {loginStep === "verifying" ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Đang xác thực với máy chủ trường...
                </>
              ) : loginStep === "success" ? (
                <>
                  <Check className="size-4 mr-2 text-primary-foreground animate-check-pop" />
                  Xác thực thành công!
                </>
              ) : (
                <>
                  <UserCheck className="size-4 mr-2" />
                  Đăng nhập Cổng đào tạo
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
