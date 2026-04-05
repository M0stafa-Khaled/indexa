import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile, getAccountStats } from "@/lib/actions/profile-actions";
import { ProfilePage } from "@/components/profile/profile-page";

export const metadata = {
  title: "Profile Settings - Indexa",
  description: "Manage your account settings and preferences",
};

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const [profileResult, statsResult] = await Promise.all([
    getUserProfile(),
    getAccountStats(),
  ]);

  if (profileResult.error || !profileResult.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Profile</h1>
          <p className="text-muted-foreground">{profileResult.error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProfilePage
      user={profileResult.user}
      stats={statsResult.success ? statsResult.stats : undefined}
    />
  );
}
