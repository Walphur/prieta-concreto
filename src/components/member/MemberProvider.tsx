"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Member } from "@/types/member";

type MemberPublic = Pick<
  Member,
  "email" | "name" | "firstDiscountUsed" | "createdAt"
>;

type MemberContextValue = {
  member: MemberPublic | null;
  loading: boolean;
  eligibleForDiscount: boolean;
  refresh: () => Promise<void>;
  register: (input: {
    email: string;
    name?: string;
  }) => Promise<{ ok: boolean; message: string; error?: string }>;
  markDiscountUsed: () => Promise<void>;
};

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberPublic | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/members/me", { cache: "no-store" });
      if (!res.ok) {
        setMember(null);
        return;
      }
      const data = (await res.json()) as { member: MemberPublic | null };
      setMember(data.member);
    } catch {
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const register = useCallback(
    async (input: { email: string; name?: string }) => {
      try {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          member?: MemberPublic;
          message?: string;
          error?: string;
        };
        if (!res.ok) {
          return {
            ok: false,
            message: data.error || "No se pudo registrar.",
            error: data.error,
          };
        }
        if (data.member) setMember(data.member);
        return {
          ok: true,
          message:
            data.message ||
            "Listo. Tenés 15% de descuento en tu primera compra.",
        };
      } catch {
        return {
          ok: false,
          message: "Error de conexión. Probá de nuevo.",
          error: "network",
        };
      }
    },
    [],
  );

  const markDiscountUsed = useCallback(async () => {
    try {
      const res = await fetch("/api/members/use-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member?.email }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { member?: MemberPublic | null };
      if (data.member) setMember(data.member);
      else await refresh();
    } catch {
      /* ignore */
    }
  }, [member?.email, refresh]);

  const value = useMemo(
    () => ({
      member,
      loading,
      eligibleForDiscount: Boolean(member && !member.firstDiscountUsed),
      refresh,
      register,
      markDiscountUsed,
    }),
    [member, loading, refresh, register, markDiscountUsed],
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) {
    throw new Error("useMember must be used within MemberProvider");
  }
  return ctx;
}
