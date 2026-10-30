import Link from "next/link";
import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { QUICK_TASKS } from "../../constants/quick-tasks";
import type { QuickTask } from "../../types";

type QuickTasksProps = {
  role: Role | null;
};

const tileClassName = "flex items-start gap-3 bg-surface px-5 py-4";

function TaskIcon({ icon }: { icon: string }) {
  return (
    <span
      aria-hidden="true"
      className="material-symbols-outlined mt-0.5 shrink-0 !text-[18px] text-subtle group-hover:text-ink"
    >
      {icon}
    </span>
  );
}

// Static links, no data: renders with the page (no Suspense needed).
export default function QuickTasks({ role }: QuickTasksProps) {
  const tasks = QUICK_TASKS.filter(
    (task) => "disabled" in task || hasPermission(role, task.permission),
  );

  if (tasks.length === 0) return null;

  return (
    <section
      aria-labelledby="quick-tasks-title"
      className="overflow-hidden rounded-card border border-line"
    >
      <h2
        id="quick-tasks-title"
        className="px-5 py-4 text-[15px] font-semibold"
      >
        Quick tasks
      </h2>
      {/* Hairline grid: the 1px gap shows the line colour between tiles. */}
      <div className="grid gap-px border-t border-line bg-line-soft sm:grid-cols-2 lg:grid-cols-5">
        {tasks.map((task: QuickTask) =>
          "disabled" in task ? (
            <div
              key={task.label}
              aria-disabled="true"
              className={tileClassName}
              title="Coming soon"
            >
              <TaskIcon icon={task.icon} />
              <span>
                <span className="flex items-center gap-2 text-[13px] font-medium text-muted">
                  {task.label}
                  <span className="rounded-full border border-line px-1.5 text-[11px] font-normal leading-4 text-subtle">
                    Soon
                  </span>
                </span>
                <span className="block text-xs text-subtle">
                  {task.description}
                </span>
              </span>
            </div>
          ) : (
            <Link
              key={task.label}
              className={`group ${tileClassName} hover:bg-background-light`}
              href={task.href}
            >
              <TaskIcon icon={task.icon} />
              <span>
                <span className="block text-[13px] font-medium">
                  {task.label}
                </span>
                <span className="block text-xs text-subtle">
                  {task.description}
                </span>
              </span>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
