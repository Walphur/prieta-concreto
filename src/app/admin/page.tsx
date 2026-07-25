import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readProducts } from "@/lib/catalog";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) return <AdminLogin />;

  const products = await readProducts();
  return <AdminPanel initialProducts={products} />;
}
