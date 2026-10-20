import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { Input } from "@/components/ui/input";

export function PasswordInput({ className, disabled, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        disabled={disabled}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-3 px-1 flex items-center text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground"
        disabled={disabled}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </button>
    </div>
  );
}
