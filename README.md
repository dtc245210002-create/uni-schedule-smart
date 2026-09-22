# Course Compass

### Nội dung Prompt (Bạn có thể copy nhanh tại đây):

    Act as a Principal Product Designer and Senior Full-Stack Engineer. Build a production-grade, highly interactive

  web application called "Intelligent Course Registration Assistant" using React, Tailwind CSS, Lucide Icons, and

  Shadcn UI components.

    ### 1. GOAL & DESIGN VISION

    Help university students effortlessly build a conflict-free semester schedule with zero mistakes, leveraging

  immediate feedback, faceted filtering, and an AI-driven Recommendation Engine.

    - Aesthetic: Modern EdTech SaaS dashboard, clean, trustworthy, high contrast.

    - Color Palette: Slate background (#F8FAFC), Deep Indigo/Blue primary (#2563EB), Emerald Green for valid courses

  (#16A34A), Crimson Red for conflicts (#DC2626), Amber for warnings/heavy workload (#D97706).

    ### 2. CORE LAYOUT: SPLIT-SCREEN DASHBOARD (Desktop first, responsive)

    #### A. TOP APP BAR (Sticky Header)

    - Left: App Logo + Title: "UniCourse AI — Intelligent Registration Assistant" + Semester Tag ("Học kỳ 2026.1").

    - Center: Quick Stats Pills:

      1. Credit Gauge: "15 / 24 Tín chỉ" (Interactive progress bar, green when 12-24, red if > 24).

      2. Workload Balance Indicator: "Vừa phải (Balanced)" with an indicator pill (Light / Balanced / Heavy).

      3. Conflict Counter: "0 Xung đột" (Green) or "⚠️ 1 Xung đột cần xử lý" (Red badge).

    - Right: "Xem giỏ đăng ký (Cart - 5)" button with counter badge + Student Profile chip ("Nguyễn Văn An - CNTT

  K66").

    #### B. MAIN WORKSPACE (Split 45% Left / 55% Right)

    #### LEFT PANEL: COURSE EXPLORATION & SMART RECOMMENDATIONS

    1. Search Bar (Dynamic Query):

       - Instant search input with debouncing, search by course code (IT3011), course name, or lecturer name.

    2. Faceted Filter Bar:

       - Filter chips/dropdowns for: Khoa (CNTT, Toán-Tin, Ngoại ngữ), Thứ trong tuần (T2 - T7), Số tín chỉ (1, 2, 3,

  4), Workload (Nhẹ, Vừa, Nặng), Lớp còn chỗ (Only Available Seats).

    3. Switchable Tabs:

       - Tab 1: "Tất cả môn học (Catalog)"

       - Tab 2: "Gợi ý thông minh (AI Recommendations)" with sparkle icon ✨.

    4. Course Card Component:

       - Header: Course Code, Course Name, Credits badge, Workload badge (Light/Medium/Heavy).

       - Smart Reason Badges (for Tab 2): e.g. "🚀 Môn then chốt (Mở khóa 3 môn)", "🎯 Khớp định hướng AI", "⚖️ Cân

  bằng tải".

       - Prerequisites tag: Shows required subjects with green checkmark (passed) or red lock (not passed).

       - Expandable Section List (Mã lớp học phần):

         - Section ID (e.g., IT3011-01), Type tag ("Lý thuyết" or "Thực hành"), Lecturer, Room, Campus (Cơ sở 1 / 2),

  Schedule (e.g., Thứ 3, Tiết 1-3 [07:30 - 10:00]).

         - Capacity indicator: e.g. "45/50 chỗ" with progress bar.

         - Actions: "Xem thử (Preview)" button on hover + "Thêm vào giỏ (Add to Cart)" primary button.

    #### RIGHT PANEL: INTERACTIVE TIMETABLE & CONFLICT ENGINE

    1. Timetable Header:

       - View controls: Thứ 2 đến Thứ 7, hiển thị các tiết học từ Tiết 1 (07:00) đến Tiết 12 (17:30).

       - Legend: Màu môn học hợp lệ, Ghost preview (xám mờ), Xung đột (đỏ viền đậm).

    2. Interactive Timetable Grid:

       - Render courses in colored blocks with course code, room, and lecturer.

       - Ghost Block feature: When user hovers over any course section in the left panel, display a dashed semi-

  transparent preview block on the timetable.

       - Overlap Detection: If two classes overlap on the same day and period, flash bright RED with warning icon ⚠️.

    3. Sticky Real-time Conflict Alert Bar (Immediate Feedback):

       - Appears below the timetable whenever conflicts are detected:

         * Time Overlap: "⚠️ Lớp IT3011-01 bị trùng lịch với MI2020-02 vào Thứ 3 tiết 3-4." -> Quick Fix button: "Đổi

  sang lớp IT3011-04 (Trống lịch)".

         * Theory-Lab Dependency: "⚠️ Lớp thực hành IT3011-Lab01 yêu cầu phải đăng ký kèm lớp lý thuyết IT3011 trong

  cùng kỳ."

         * Over-credit limit: "⚠️ Tổng số tín chỉ đang vượt quá hạn mức 24 TC."

    4. Registration Cart Drawer / Summary & Checkout:

       - Collapsible summary listing all selected classes with remove (trash) icon.

       - Cascading removal: Removing a theory class displays a warning if a linked lab class is present.

       - "Xác nhận ghi danh (Confirm Registration)" prominent button.

    ### 3. INTERACTIVE BEHAVIORS & MOCK DATA

    Include pre-loaded rich realistic mock data:

    1. Student: Nguyen Van An, Major: Computer Science, Completed courses: "Toán tin 1 (A)", "Giải tích (B+)", "Nhập

  môn lập trình (A)". Interests: ['AI', 'Data'].

    2. 6-8 sample courses including:

       - "IT3011 - Cấu trúc dữ liệu & Giải thuật" (Lý thuyết) + "IT3011L - Thực hành Cấu trúc dữ liệu" (Thực hành,

  requires IT3011).

       - "MI2020 - Xác suất thống kê" (3 TC, Heavy).

       - "IT4010 - Trí tuệ nhân tạo cơ bản" (AI Interest match, opens 2 future courses).

       - "SSH1110 - Kỹ năng giao tiếp" (Light workload, elective).

       - Conflicting section options to easily test time conflict and quick-fix button.

    3. Functional States:

       - Full client-side state handling for adding/removing sections, hover previews, real-time conflict checking,

  dynamic search filtering, and confirmation modal.

       - Confirmation Modal: Displays a pre-flight checklist (All prerequisites satisfied ✅, 0 conflicts ✅, Total

  credits 18/24 ✅), a "Xác nhận thành công" animation, and "Xuất ra Google Calendar (.ics)" button.

    Ensure the UI feels ultra-responsive, polished, with subtle animations (Framer Motion / Tailwind transitions) and

  immediate visual feedback on every single click.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://uni-schedule-smart.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/95882fab-4097-424d-91b3-1d29e9abc95c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
