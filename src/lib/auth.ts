export type StudentUser = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  faculty: string;
  classId: string;
  cohort: string;
  program: string;
  creditsAccumulated: number;
  cpa: number;
  avatarColor: string;
};

export const MOCK_STUDENTS: StudentUser[] = [
  {
    id: "std-01",
    name: "Nguyễn Văn An",
    email: "an.nv210012@sis.edu.vn",
    studentId: "20210012",
    faculty: "CNTT",
    classId: "Khoa học máy tính 02 - K66",
    cohort: "K66 (2021 - 2026)",
    program: "Kỹ sư Công nghệ thông tin",
    creditsAccumulated: 74,
    cpa: 3.45,
    avatarColor: "bg-primary text-primary-foreground",
  },
  {
    id: "std-02",
    name: "Lê Thị Mai",
    email: "mai.lt220045@sis.edu.vn",
    studentId: "20220045",
    faculty: "Toán-Tin",
    classId: "Toán tin ứng dụng 01 - K67",
    cohort: "K67 (2022 - 2027)",
    program: "Cử nhân Toán ứng dụng & AI",
    creditsAccumulated: 42,
    cpa: 3.68,
    avatarColor: "bg-emerald-600 text-white",
  },
  {
    id: "std-03",
    name: "Trần Hoàng Nam",
    email: "nam.th200088@sis.edu.vn",
    studentId: "20200088",
    faculty: "Ngoại ngữ",
    classId: "Tiếng Anh chuyên ngành 03 - K65",
    cohort: "K65 (2020 - 2025)",
    program: "Cử nhân Ngôn ngữ Anh & Công nghệ",
    creditsAccumulated: 112,
    cpa: 3.25,
    avatarColor: "bg-amber-600 text-white",
  },
];

export const DEFAULT_STUDENT = MOCK_STUDENTS[0];

const STORAGE_KEY = "unicourse_auth_user";

export function getStoredUser(): StudentUser | null {
  if (typeof window === "undefined") return DEFAULT_STUDENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STUDENT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STUDENT;
  }
}

export function saveStoredUser(user: StudentUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn("Cannot save auth state to localStorage", err);
  }
}

export function createMockUserFromEmail(email: string): StudentUser {
  const cleanEmail = email.trim().toLowerCase();
  const found = MOCK_STUDENTS.find((s) => s.email.toLowerCase() === cleanEmail);
  if (found) return found;

  // Derive mock data from custom email
  const prefix = cleanEmail.split("@")[0] || "sinhvien";
  const parts = prefix.split(/[._]/);
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  const matchNum = prefix.match(/\d+/);
  const studentId = matchNum ? matchNum[0].padStart(8, "2022") : `2022${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: `custom-${Date.now()}`,
    name: name || "Sinh viên",
    email: cleanEmail,
    studentId,
    faculty: "CNTT",
    classId: `CNTT-01 - K67`,
    cohort: "K67 (2022 - 2027)",
    program: "Cử nhân Công nghệ thông tin",
    creditsAccumulated: 56,
    cpa: 3.3,
    avatarColor: "bg-indigo-600 text-white",
  };
}
